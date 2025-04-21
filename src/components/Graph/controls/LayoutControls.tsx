import React from 'react';
import { Switch } from '@headlessui/react';

interface LayoutControlsProps {
  selectedLayout: string;
  onLayoutChange: (layout: string) => void;
  physicsEnabled: boolean;
  onPhysicsToggle: (enabled: boolean) => void;
  onRefresh: () => void;
  onAnalytics: () => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  selectedLayout,
  onLayoutChange,
  physicsEnabled,
  onPhysicsToggle,
  onRefresh,
  onAnalytics
}) => {

  // Helper function for button classes
  const getButtonClasses = (layoutName: string) => {
    // Corrected multiline template literal syntax
    const baseClasses = `
      px-3 py-1 text-xs font-medium rounded transition-colors duration-150 
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
    `;
    if (selectedLayout === layoutName) {
      // Contained / Selected style
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    } else {
      // Outlined / Unselected style
      // Corrected multiline template literal syntax
      return `${baseClasses} border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-700`;
    }
  };

  // Corrected multiline template literal syntax
  const actionButtonBaseClasses = `
    w-full px-3 py-1.5 text-xs font-medium rounded transition-colors duration-150 
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
  `;

  return (
    // Replaced Paper with styled div
    <div 
      className="absolute top-4 left-4 z-10 p-4 rounded-lg shadow-lg 
                 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                 w-56 border border-gray-200 dark:border-gray-700"
    >
      {/* Replaced Typography */}
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
        Graph Controls
      </h3>
      
      {/* Replaced Box and ButtonGroup */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
          Layout
        </label>
        {/* Replaced ButtonGroup */}
        <div className="flex space-x-1">
          {/* Replaced Button */}
          <button 
            onClick={() => onLayoutChange('force')}
            className={`flex-1 ${getButtonClasses('force')}`}
          >
            Force
          </button>
          <button 
            onClick={() => onLayoutChange('radial')}
            className={`flex-1 ${getButtonClasses('radial')}`}
          >
            Radial
          </button>
        </div>
        {/* Replaced ButtonGroup */}
        <div className="flex space-x-1 mt-1">
          {/* Replaced Button */}
          <button 
            onClick={() => onLayoutChange('hierarchical')}
            className={`flex-1 ${getButtonClasses('hierarchical')}`}
          >
            Hierarchy
          </button>
          <button 
            onClick={() => onLayoutChange('timeline')}
            className={`flex-1 ${getButtonClasses('timeline')}`}
          >
            Timeline
          </button>
        </div>
      </div>
      
      {/* Replaced Box, FormControlLabel, and MUI Switch */}
      <div className="mb-4">
        <Switch.Group as="div" className="flex items-center justify-between">
          <Switch.Label className="text-xs font-medium text-gray-600 dark:text-gray-300 mr-2" passive>
            Enable Physics
          </Switch.Label>
          <Switch
            checked={physicsEnabled}
            onChange={onPhysicsToggle}
            className={`${physicsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
              relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
              focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">Enable Physics</span>
            <span
              aria-hidden="true"
              className={`${physicsEnabled ? 'translate-x-4' : 'translate-x-0'}
                pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 
                transition duration-200 ease-in-out`}
            />
          </Switch>
        </Switch.Group>
      </div>
      
      {/* Replaced Box */}
      <div className="flex gap-2">
        {/* Replaced Button */}
        <button 
          className={`${actionButtonBaseClasses} border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
          onClick={onRefresh}
        >
          Refresh
        </button>
        {/* Replaced Button */}
        <button 
          className={`${actionButtonBaseClasses} bg-blue-600 text-white hover:bg-blue-700`}
          onClick={onAnalytics}
        >
          Analytics
        </button>
      </div>
    </div>
  );
};

export default LayoutControls;
