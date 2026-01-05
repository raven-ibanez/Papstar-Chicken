import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-white border-b-4 border-papstar-black md:hidden shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-4 space-x-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2 rounded-lg transition-all duration-200 border-2 border-papstar-black shadow-[3px_3px_0_#111111] font-bangers tracking-wide ${activeCategory === category.id
                ? 'bg-papstar-red text-white scale-105'
                : 'bg-papstar-yellow text-papstar-black hover:bg-white active:translate-y-1 active:shadow-none'
              }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-lg whitespace-nowrap uppercase">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;