import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (

    <header className="sticky top-0 z-50 bg-papstar-red shadow-lg border-b-4 border-papstar-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onMenuClick}
            className="flex items-center space-x-3 group"
          >
            {loading ? (
              <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-papstar-yellow rounded-full transform group-hover:scale-110 transition-transform duration-200 border-2 border-papstar-black"></div>
                <img
                  src={siteSettings?.site_logo || "/logo.jpg"}
                  alt={siteSettings?.site_name || "Papstar Chicken"}
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-papstar-black"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.jpg";
                  }}
                />
              </div>
            )}
            <h1 className="text-3xl font-bangers tracking-wide text-white drop-shadow-[2px_2px_0_#111111] transform group-hover:scale-105 transition-transform duration-200">
              {loading ? (
                <div className="w-32 h-8 bg-white/20 rounded animate-pulse" />
              ) : (
                "Papstar Chicken"
              )}
            </h1>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onCartClick}
              className="relative p-3 bg-white text-papstar-black rounded-full hover:bg-papstar-yellow hover:scale-110 transition-all duration-200 border-2 border-papstar-black shadow-[2px_2px_0_#111111] hover:shadow-[4px_4px_0_#111111] active:translate-y-1 active:shadow-none"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-papstar-yellow text-papstar-black text-sm font-bangers border-2 border-papstar-black rounded-full h-7 w-7 flex items-center justify-center animate-bounce-gentle shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;