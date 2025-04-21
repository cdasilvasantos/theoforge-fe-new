'use client';

import React from 'react';
import Image from 'next/image';
import { CharacterData, formatCharacterName } from '@/lib/characterUtils.client';
import { X, Search } from 'lucide-react';

interface CharacterSelectorProps {
  characters: CharacterData[];
  selectedCharacter: CharacterData | null;
  onSelectCharacter: (character: CharacterData) => void;
  onClose?: () => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  selectedCharacter,
  onSelectCharacter,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCharacters = React.useMemo(() => {
    // Guard against undefined characters
    if (!characters || !Array.isArray(characters)) return [];
    
    if (!searchTerm.trim()) return characters;

    const term = searchTerm.toLowerCase();
    return characters.filter(char => 
      char.name.toLowerCase().includes(term) || 
      (char.title && char.title.toLowerCase().includes(term))
    );
  }, [characters, searchTerm]);

  // Handle case where characters is undefined or empty
  if (!characters || !Array.isArray(characters) || characters.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No characters available.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-poppins font-medium text-base text-gray-800 dark:text-gray-100">
          Characters
        </h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            aria-label="Close character panel"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg pl-10 pr-4 py-1.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-primary-dark dark:focus:border-primary-dark focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto px-3 py-2">
        <div className="space-y-1.5">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
              No characters match your search
            </div>
          ) : (
            filteredCharacters.map((character) => (
              <div 
                key={character.id}
                className={`flex items-center p-2 rounded-md cursor-pointer ${selectedCharacter?.id === character.id ? 'bg-primary/10 dark:bg-primary-dark/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                onClick={() => onSelectCharacter(character)}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3 flex-shrink-0">
                  <Image
                    src={`/characters/${character.id}.png`}
                    alt={formatCharacterName(character.name)}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      // If the image fails to load, fallback to default avatar
                      const target = e.target as HTMLImageElement;
                      target.src = '/characters/images/default-avatar.png';
                      target.onerror = null; // Prevent infinite loop
                    }}
                  />
                </div>
                <div className="flex-grow overflow-hidden">
                  <h3 className="font-poppins font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                    {character.name}
                  </h3>
                  {character.title && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {character.title}
                    </p>
                  )}
                </div>
                {selectedCharacter?.id === character.id && (
                  <div className="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark ml-2 flex-shrink-0"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelector;
