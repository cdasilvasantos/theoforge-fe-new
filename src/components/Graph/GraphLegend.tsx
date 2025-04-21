'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

// Helper function to add alpha - needed for consistency with graph link colors
const addAlpha = (color: string, opacity: number): string => {
  if (!color || !color.startsWith('#')) {
    console.warn(`Invalid color format for addAlpha: ${color}. Using fallback.`);
    return `rgba(128, 128, 128, ${opacity})`; // Fallback grey
  }
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase().padStart(2, '0');
};

// Helper function to calculate hue from era name (or other string)
const getHueFromString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return (hash % 256) / 256;
};

// Define era order and descriptions for consistency
const eraInfo = {
  'Ancient': { order: 1, desc: 'Classical & Hellenistic (800 BCE - 500 CE)' },
  'Medieval': { order: 2, desc: 'Middle Ages (500 - 1400 CE)' },
  'Renaissance': { order: 3, desc: 'Renaissance (1400 - 1600 CE)' },
  'Enlightenment': { order: 4, desc: 'Age of Reason (1600 - 1800 CE)' },
  'Modern': { order: 5, desc: 'Modern Era (1800 - 1950 CE)' },
  'Contemporary': { order: 6, desc: 'Current Era (1950 - Present)' }
};

interface GraphLegendProps {
  availableEras: string[];
  activeEras: string[];
  onToggleEra: (era: string) => void;
  className?: string; // Allow passing additional classes
}

const GraphLegend: React.FC<GraphLegendProps> = ({
  availableEras,
  activeEras,
  onToggleEra,
  className, // Destructure className
}) => {
  const linkOpacity = 0.6; // Consistent opacity for legend lines

  // Use hex codes matching EnterprisePhilosopherGraph
  const nodeStates = [
    { name: 'Selected', color: '#B8860B', type: 'node' }, // secondary.main
    { name: 'Hovered', color: '#bdbdbd', type: 'node' }, // Grey 400 approximation
  ];

  const relationshipTypes = [
    { name: 'Influenced by', color: addAlpha('#81c784', linkOpacity), type: 'link' }, // success.light
    { name: 'Student of', color: addAlpha('#64b5f6', linkOpacity), type: 'link' }, // info.light
    { name: 'Intellectual Partner', color: addAlpha('#ffb74d', linkOpacity), type: 'link' }, // warning.light
    { name: 'Other', color: addAlpha('#9e9e9e', linkOpacity * 0.8), type: 'link' }, // grey[500]
  ];

  return (
    <div
      // Use twMerge to combine base styles with passed className
      className={twMerge(
        'p-4 bg-white/90 dark:bg-neutral-800/90 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700',
        className // Apply additional classes
      )}
    >
      <h6 className="text-sm font-semibold mb-2 text-text-primary dark:text-dark-text-primary">Legend</h6>

      <p className="text-xs font-bold mb-1 text-gray-700">Node States</p>
      {nodeStates.map((state) => (
        <div key={state.name} className="flex items-center mb-1">
          <div className="mr-2 flex items-center">
            <div
              className="w-3 h-3 rounded-full border border-gray-400"
              style={{ backgroundColor: state.color }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{state.name}</span>
        </div>
      ))}

      <hr className="my-2 border-gray-200" />

      <p className="text-xs font-bold mb-1 text-gray-700">Relationship Types</p>
      {relationshipTypes.map((rel) => (
        <div key={rel.name} className="flex items-center mb-1">
          <div className="mr-2 flex items-center">
            <div
              className="w-4 h-1"
              style={{ backgroundColor: rel.color }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{rel.name}</span>
        </div>
      ))}

      {/* Era Filters - Only show if availableEras has items */}
      {availableEras.length > 0 && (
        <>
          <hr className="my-2 border-border-light dark:border-border-dark" />
          <p className="text-xs font-bold mb-1 text-text-secondary dark:text-dark-text-secondary">Filter by Era</p>
          <div className="flex flex-wrap gap-2">
            {availableEras
              // Sort chronologically based on predefined order
              .sort((a, b) => {
                const orderA = eraInfo[a as keyof typeof eraInfo]?.order || 999;
                const orderB = eraInfo[b as keyof typeof eraInfo]?.order || 999;
                return orderA - orderB;
              })
              .map((era) => {
                const isActive = activeEras.includes(era);
                const eraDesc = eraInfo[era as keyof typeof eraInfo]?.desc || '';

                return (
                  <button
                    key={era}
                    onClick={() => onToggleEra(era)}
                    className={`
                      px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 
                      ${isActive 
                        ? 'bg-primary text-white border border-primary-dark shadow-sm' 
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-primary/50 hover:text-primary'}
                    `}
                    title={eraDesc ? `${era}: ${eraDesc}` : `Toggle ${era} filter`}
                  >
                    {era}
                  </button>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default GraphLegend;
