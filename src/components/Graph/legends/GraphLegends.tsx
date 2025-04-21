'use client';

import React from 'react';
import { CommunityInfo, RelationInfo } from '../../../types/graph';

export interface GraphLegendsProps {
  /**
   * Community information for legend display
   */
  communities?: CommunityInfo[];
  
  /**
   * Relation type information for legend display
   */
  relations?: RelationInfo[];
  
  /**
   * Position of the *community* legends panel
   * Relation legend is fixed bottom-right.
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Default relation types for legend
 */
const DEFAULT_RELATIONS: RelationInfo[] = [
  { type: 'default', name: 'Connection', color: '#aaaaaa' }
];

/**
 * Legends panel for graph visualization
 */
export const GraphLegends: React.FC<GraphLegendsProps> = ({
  communities = [],
  relations = DEFAULT_RELATIONS,
  position = 'top-right'
}) => {
  // Define position Tailwind classes
  const positionClassesMap = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-20 right-4', // Adjusted for potential header
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const communityPositionClasses = positionClassesMap[position];
  const relationPositionClasses = 'bottom-4 right-4'; // Fixed position for relation legend
  
  // Common panel classes
  const panelBaseClasses = `
    absolute p-3 rounded-lg shadow-md 
    bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
    z-10 max-w-[250px]`;

  // Only render if there are communities or relations to display
  if (communities.length === 0 && relations.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Community Legend - Replaced Paper/Box/Typography */}
      {communities.length > 0 && (
        <div className={`${panelBaseClasses} ${communityPositionClasses}`}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
            Groups
          </h3>
          <div className="flex flex-col gap-2"> 
            {communities.map(community => (
              <div key={community.id} className="flex items-start gap-2"> 
                {/* Color Swatch - Replaced Box */}
                <div 
                  className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" 
                  style={{ backgroundColor: community.color || '#00695C' /* Default Teal */ }} 
                />
                {/* Text Content - Replaced Box/Typography */}
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{community.name}</p>
                  {community.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                      {community.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Relation Legend - Replaced Paper/Box/Typography */}
      {/* Ensure relation legend doesn't overlap with community legend if both are bottom-right */}
      {relations.length > 0 && (
        <div 
          className={`
            ${panelBaseClasses} ${relationPositionClasses}
            ${position === 'bottom-right' && communities.length > 0 ? 'mb-24' : ''} 
          `}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
            Connection Types
          </h3>
          <div className="flex flex-col gap-1.5"> 
            {relations.map(relation => (
              <div key={relation.type} className="flex items-center gap-2"> 
                {/* Color Line Swatch - Replaced Box */}
                <div 
                  className="w-5 h-0.5 flex-shrink-0"
                  style={{ backgroundColor: relation.color || '#aaaaaa' /* Default Gray */ }} 
                />
                {/* Replaced Typography */}
                <p className="text-sm text-gray-800 dark:text-gray-100 leading-tight">{relation.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
