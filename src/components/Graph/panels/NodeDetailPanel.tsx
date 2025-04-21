'use client';

import React from 'react';
// import Link from 'next/link'; // Commented out unused import
import { GraphNode, GraphLink } from '../../../types/graph';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
const LaunchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export interface NodeDetailPanelProps {
  /**
   * The node to display details for
   */
  node: GraphNode | null;
  
  /**
   * Handler for closing the panel
   */
  onClose: () => void;
  
  /**
   * Position of the panel
   */
  position?: 'left' | 'right';
  
  /**
   * Width of the panel
   */
  width?: number | string;
  
  /**
   * All nodes for connection lookup
   */
  allNodes: GraphNode[];
  
  /**
   * All links for connection lookup
   */
  links: GraphLink[];
  
  /**
   * Top score for normalization
   */
  topScore?: number;
  
  /**
   * Optional theme colors
   */
  themeColors?: {
    primary: string;
    secondary: string;
    muted: string;
    lightMuted: string;
    background: string;
  };
}

function formatNumber(num: number | undefined): string {
  if (num === undefined) return 'N/A';
  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Panel for displaying detailed information about a selected node
 */
export function NodeDetailPanel({
  node,
  onClose,
  position = 'right',
  width = 350,
  allNodes,
  links,
  topScore = 0,
  themeColors
}: NodeDetailPanelProps) {
  interface Connection {
    node: GraphNode;
    type: string;
  }

  const connections: Connection[] = React.useMemo(() => {
    // Guard against missing data
    if (!node || links.length === 0 || allNodes.length === 0) {
      console.log("Node, links, or allNodes not available for connections calculation.");
      return [];
    }
    
    const relatedLinks = links
      .filter(link => link.source === node.id || link.target === node.id)

    const connectionData = relatedLinks.map(link => {
        const connectedNodeId = link.source === node.id ? link.target : link.source;
        const connectedNode = allNodes.find(n => n.id === connectedNodeId);
        return { node: connectedNode, type: link.relation ?? link.type ?? 'unknown' }; // Check for relation first, then type, then use unknown as fallback
      })
      .filter((conn): conn is Connection => conn.node !== undefined); // Type guard to filter out undefined nodes

    // console.log("Calculated Connections:", connectionData);
    return connectionData;
  }, [node, links, allNodes]);

  const influenceProgress = node?.influenceScore !== undefined 
                            ? Math.min(100, Math.max(0, (node.influenceScore / (topScore > 0 ? topScore : 1)) * 100)) // Avoid division by zero/NaN
                            : 0;

  return (
    <div
      className={`
        fixed sm:absolute bottom-0 sm:top-20 left-0 right-0 sm:${position === 'left' ? 'left-4 right-auto' : 'right-4 left-auto'}
        bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
        border border-gray-200 dark:border-gray-700
        rounded-t-lg sm:rounded-lg shadow-lg overflow-y-auto 
        z-20 transition-all duration-300 ease-in-out
        max-h-[70vh] sm:max-h-[calc(100vh-100px)] w-full sm:max-w-md
      `}
      style={{ width: typeof width === 'number' && window.innerWidth >= 640 ? `${width}px` : 'auto' }}
    >
      <div className="
        flex justify-between items-center p-3 
        bg-gradient-to-r from-teal-700 to-teal-900 text-white 
        rounded-t-lg sticky top-0 z-10
      ">
        <h2 className="text-lg font-semibold truncate mr-2">
          {node?.name || 'Details'}
        </h2>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close details"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {node?.description && (
          <>
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{node.description}</p>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.wikipediaUrl && (
          <>
            <a 
              href={node.wikipediaUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="
                flex items-center text-sm font-medium 
                text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 
                transition-colors duration-150
              "
            >
              <LaunchIcon /> <span className="ml-1">Wikipedia</span>
            </a>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.influenceScore !== undefined && (
          <>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Influence Score</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${influenceProgress}%` }}
                      role="progressbar"
                      aria-valuenow={influenceProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                  ></div>
              </div>
              <p className="text-xs text-right text-gray-500 dark:text-gray-400">{formatNumber(node.influenceScore)}</p>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.era && (
          <>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Era</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{node.era}</p>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.born || node?.died && (
          <>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Life</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{node.born || 'N/A'} - {node.died || 'N/A'}</p>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.schools && node.schools.length > 0 && (
          <>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Schools</h3>
              <div className="flex flex-wrap gap-1">
                {node.schools.map((school) => (
                  <span 
                    key={school} 
                    className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-xs font-medium"
                  >
                    {school}
                  </span>
                ))}
              </div>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.contributions && node.contributions.length > 0 && (
          <>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Key Contributions</h3>
              <ul className="pl-4 space-y-1">
                {node.contributions.map((contribution, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pb-1">
                    {contribution}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {node?.key_ideas && node.key_ideas.length > 0 && (
          <>
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Key Ideas</h3>
              <ul className="pl-4 space-y-1">
                {node.key_ideas.map((idea, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 pb-1">
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
          </>
        )}

        {connections.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Connections</h3>
            <ul className="max-h-36 sm:max-h-48 overflow-y-auto -mx-1 rounded">
              {connections.map((conn, index) => (
                <li 
                  key={`${conn.node.id}-${index}`} 
                  className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span className="font-medium">{conn.node.name}</span> 
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({conn.type})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.entries(node || {})
          .filter(([key, value]) => 
              !['id', 'name', 'description', 'wikipediaUrl', 'influenceScore', 'era', 'born', 'died', 'schools', 'contributions', 'key_ideas', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'community', 'index', '__indexColor', '__viz'].includes(key) &&
              value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)
          )
          .map(([key, value]) => {
            const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return (
              <div key={key} className="space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{displayValue}</p>
              </div>
            );
          })
          .filter(Boolean)}
      </div>
    </div>
  );
}
