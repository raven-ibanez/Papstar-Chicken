import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-white border-b-4 border-papstar-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 overflow-x-auto py-4 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-6 py-2 rounded-lg text-lg font-bangers tracking-wide transition-all duration-200 border-2 border-papstar-black shadow-[3px_3px_0_#111111] ${selectedCategory === 'all'
                    ? 'bg-papstar-red text-white hover:bg-papstar-red hover:scale-105'
                    : 'bg-white text-papstar-black hover:bg-papstar-yellow hover:scale-105 active:translate-y-1 active:shadow-none'
                  }`}
              >
                ALL MENU
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-5 py-2 rounded-lg text-lg font-bangers tracking-wide transition-all duration-200 border-2 border-papstar-black shadow-[3px_3px_0_#111111] flex items-center space-x-2 ${selectedCategory === c.id
                      ? 'bg-papstar-red text-white hover:bg-papstar-red hover:scale-105'
                      : 'bg-white text-papstar-black hover:bg-papstar-yellow hover:scale-105 active:translate-y-1 active:shadow-none'
                    }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="uppercase">{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


