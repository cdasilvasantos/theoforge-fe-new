import React from 'react';

interface FilterChipsProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onToggle: (item: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ title, items, selectedItems, onToggle }) => {

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <span className="block mb-1 text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400">
        {title}
      </span>
      <div className="flex flex-row flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          const baseClasses = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-150 ease-in-out";
          const selectedClasses = "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600";
          const defaultClasses = "bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;
