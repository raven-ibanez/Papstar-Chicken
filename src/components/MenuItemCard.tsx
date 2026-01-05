import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  quantity,
  onUpdateQuantity
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn =>
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);

      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }

      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>

      <div className={`bg-white rounded-2xl border-4 border-papstar-black shadow-[6px_6px_0_#111111] hover:shadow-[10px_10px_0_#E62325] hover:-translate-y-1 transition-all duration-200 overflow-hidden group h-full flex flex-col ${!item.available ? 'opacity-80 grayscale' : ''}`}>
        {/* Image Container */}
        <div className="relative h-48 bg-papstar-yellow border-b-4 border-papstar-black overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="text-6xl animate-bounce-gentle">🍗</div>
          </div>

          {/* Badges - Comic Style */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-papstar-red text-white text-sm font-bangers tracking-wide px-3 py-1 rounded-lg border-2 border-papstar-black shadow-[2px_2px_0_#111111] animate-pulse -rotate-2">
                SALE!
              </div>
            )}
            {item.popular && (
              <div className="bg-papstar-yellow text-papstar-black text-sm font-bangers tracking-wide px-3 py-1 rounded-lg border-2 border-papstar-black shadow-[2px_2px_0_#111111] rotate-2">
                POPULAR
              </div>
            )}
          </div>

          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-papstar-red text-white text-xl font-bangers px-6 py-2 border-4 border-white -rotate-12 shadow-lg">
                SOLD OUT!
              </div>
            </div>
          )}

          {/* Discount Percentage Badge */}
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-3 right-3 bg-white text-papstar-red text-lg font-bangers px-2 py-1 rounded-lg border-2 border-papstar-black shadow-[3px_3px_0_#111111] rotate-3">
              {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-2xl font-bangers text-papstar-black leading-none flex-1 pr-2 tracking-wide">{item.name}</h4>
          </div>

          <p className="text-sm text-gray-600 mb-4 flex-grow font-medium leading-relaxed border-l-4 border-papstar-yellow pl-3">
            {!item.available ? 'Currently Unavailable' : item.description}
          </p>

          {/* Pricing Section */}
          <div className="mt-auto">
            <div className="flex items-end justify-between mb-4">
              <div className="flex-1">
                {item.isOnDiscount && item.discountPrice ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bangers text-papstar-red">
                        ₱{item.discountPrice.toFixed(0)}
                      </span>
                      <span className="text-lg font-bangers text-gray-400 line-through decoration-2">
                        ₱{item.basePrice.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-bangers text-papstar-black">
                    ₱{item.basePrice.toFixed(0)}
                  </div>
                )}

                {item.variations && item.variations.length > 0 && (
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Starts at
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full">
              {!item.available ? (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl border-2 border-gray-300 font-bangers text-xl tracking-wider cursor-not-allowed"
                >
                  UNAVAILABLE
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-papstar-red text-white py-3 rounded-xl border-2 border-papstar-black hover:bg-white hover:text-papstar-red transition-all duration-200 shadow-[4px_4px_0_#111111] hover:shadow-[6px_6px_0_#111111] hover:-translate-y-1 active:translate-y-0 active:shadow-none font-bangers text-xl tracking-wider group-hover:scale-100"
                >
                  {item.variations?.length || item.addOns?.length ? 'CUSTOMIZE + ADD' : 'ADD TO CART'}
                </button>
              ) : (
                <div className="flex items-center justify-between bg-papstar-yellow rounded-xl p-1 border-2 border-papstar-black shadow-[4px_4px_0_#111111]">
                  <button
                    onClick={handleDecrement}
                    className="p-2 hover:bg-white rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-papstar-black"
                  >
                    <Minus className="h-5 w-5 text-papstar-black" strokeWidth={3} />
                  </button>
                  <span className="font-bangers text-2xl text-papstar-black min-w-[30px] text-center pt-1">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 hover:bg-white rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-papstar-black"
                  >
                    <Plus className="h-5 w-5 text-papstar-black" strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Customize {item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedVariation?.id === variation.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="font-medium text-gray-900">{variation.name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{addOn.name}</span>
                              <div className="text-sm text-gray-600">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-red-100 rounded-xl p-1 border border-red-200">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-red-600" />
                                  </button>
                                  <span className="font-semibold text-gray-900 min-w-[24px] text-center text-sm">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-red-200 rounded-lg transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-red-600" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-lg"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-red-600">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ₱{calculatePrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;