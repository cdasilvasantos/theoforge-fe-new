import React, { useState, useEffect, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { GraphNode } from '@/types/graph';

const SearchIconSVG = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-5 h-5 text-gray-400"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
    />
  </svg>
);

const LoadingSpinnerSVG = () => (
  <svg 
    className="animate-spin h-5 w-5 text-gray-500" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    ></circle>
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

interface SearchBarProps {
  data: GraphNode[];
  onSelect: (node: GraphNode | null) => void;
  onSearchChange?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ data, onSelect, onSearchChange }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<GraphNode[]>([]);
  const [isOpen, setIsOpen] = useState(false); 
  const loading = isOpen && options.length === 0 && data.length > 0 && inputValue === ''; 

  useEffect(() => {
    if (data.length > 0) {
      setOptions(data);
    }
  }, [data]);

  useEffect(() => {
    if (!isOpen) {
      setOptions([]); 
      return;
    }

    if (inputValue === '') {
      setOptions(data.slice(0, 10)); 
      return;
    }

    const filtered = data.filter(
      (option) =>
        (option.name?.toLowerCase() ?? '').includes(inputValue.toLowerCase()) ||
        (option.era?.toLowerCase() ?? '').includes(inputValue.toLowerCase()) ||
        (option.community !== undefined && String(option.community).toLowerCase().includes(inputValue.toLowerCase()))
    );
    
    setOptions(filtered.slice(0, 15)); 
  }, [inputValue, isOpen, data]);

  return (
    <div className="relative w-full"> 
      <Combobox 
        value={selectedNode} 
        onChange={(selected) => { 
          setSelectedNode(selected);
          onSelect(selected);
          setInputValue(selected?.name || ''); 
          setIsOpen(false); 
        }} 
        nullable 
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIconSVG />
          </div>
          <Combobox.Input
            className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                       py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none 
                       shadow-sm hover:shadow-md focus:shadow-lg transition-shadow duration-200"
            placeholder="Search philosophers..."
            displayValue={(node: GraphNode) => node?.name || ''}
            onChange={(event) => {
              const newInputValue = event.target.value;
              setInputValue(newInputValue);
              if (!isOpen) setIsOpen(true); 
              if (onSearchChange) {
                onSearchChange(newInputValue);
              }
            }}
            onFocus={() => setIsOpen(true)} 
            // Consider onBlur to close if needed, but selection/escape should handle it
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading && <LoadingSpinnerSVG />} 
          </div>
        </div>

        <Transition
          as={Fragment}
          show={isOpen} 
          afterLeave={() => setInputValue(selectedNode?.name || '')} 
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options 
            static 
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md 
                       bg-white dark:bg-gray-700 py-1 text-base shadow-lg 
                       ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {loading && (
               <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">Loading...</div>
            )}
            {!loading && options.length === 0 && inputValue !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                No philosophers found.
              </div>
            ) : (
              options.map((node) => {
                const communityValue = node.community?.toString() ?? '0';
                const communityNumber = parseInt(communityValue, 10);
                const colorHue = isNaN(communityNumber) ? 0 : (communityNumber * 137.5) % 360;
                const avatarColor = node.community !== undefined ? `hsl(${colorHue}, 60%, 60%)` : '#9ca3af'; 

                return (
                  <Combobox.Option
                    key={node.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 
                       ${active ? 'bg-blue-100 dark:bg-blue-600 text-blue-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`
                    }
                    value={node}
                  >
                    {({ selected, active }) => (
                      <div className="flex items-center"> 
                        <div 
                          className="w-8 h-8 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {node.name?.charAt(0).toUpperCase() ?? '-'} 
                        </div>
                        <div className="flex-grow truncate">
                          <p className={`text-sm truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {node.name ?? 'Unnamed Node'}
                          </p>
                          <p className={`text-xs truncate ${active ? 'text-blue-800 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                            {node.era ?? 'Unknown Era'} • {node.community !== undefined ? `Group ${node.community}` : 'Unknown group'}
                          </p>
                        </div>
                      </div>
                    )}
                  </Combobox.Option>
                );
              })
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};

export default SearchBar;
