'use client';

import React, { useMemo } from 'react';
import { GraphData, GraphNode, GraphLink } from '../../../types/graph';

// SVG Icon
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export interface AnalyticsPanelProps<
  NodeType extends GraphNode = GraphNode, 
  LinkType extends GraphLink = GraphLink
> {
  /**
   * The graph data to analyze
   */
  data: GraphData<NodeType, LinkType>;
  
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
}

// Helper to format numbers
function formatNumber(num: number | undefined, precision: number = 0): string {
  if (num === undefined) return 'N/A';
  return num.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision });
}

/**
 * Panel for displaying analytics about the graph
 */
export function AnalyticsPanel<
  NodeType extends GraphNode = GraphNode, 
  LinkType extends GraphLink = GraphLink
>({
  data,
  onClose,
  position = 'left',
  width = 350
}: AnalyticsPanelProps<NodeType, LinkType>) {
  // Calculate basic network statistics
  const stats = useMemo(() => {
    const nodeCount = data.nodes.length;
    const linkCount = data.links.length;
    const density = nodeCount > 1 ? (2 * linkCount) / (nodeCount * (nodeCount - 1)) : 0;
    
    // Calculate degree for each node
    const nodeDegrees = data.nodes.map(node => {
      const nodeId = node.id;
      const connections = data.links.filter(link => 
        (link.source === nodeId || 
         (typeof link.source === 'object' && link.source.id === nodeId)) || 
        (link.target === nodeId || 
         (typeof link.target === 'object' && link.target.id === nodeId))
      );
      return {
        id: nodeId,
        name: node.name || String(nodeId),
        degree: connections.length
      };
    });
    
    // Sort nodes by degree
    const topConnectedNodes = [...nodeDegrees]
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 5);
    
    // Find communities if available
    const communities: Record<string, number> = {};
    data.nodes.forEach(node => {
      if ('community' in node) {
        const communityId = String(node.community);
        communities[communityId] = (communities[communityId] || 0) + 1;
      }
    });
    
    // Find relation types if available
    const relationTypes: Record<string, number> = {};
    data.links.forEach(link => {
      if ('relation' in link) {
        const relationType = String(link.relation || 'default');
        relationTypes[relationType] = (relationTypes[relationType] || 0) + 1;
      }
    });
    
    return {
      nodeCount,
      linkCount,
      density,
      topConnectedNodes,
      communities,
      relationTypes
    };
  }, [data]);

  // Find max values for normalization
  const maxDegree = stats.topConnectedNodes[0]?.degree || 1;
  const maxCommunitySize = Math.max(...Object.values(stats.communities), 1);
  const maxRelationCount = Math.max(...Object.values(stats.relationTypes), 1);

  // Determine position styles using Tailwind classes
  const positionClasses = {
    'left': 'left-4',
    'right': 'right-4'
  };

  return (
    // Replaced Paper with div and Tailwind
    <div
      className={`
        absolute top-20 ${positionClasses[position]}
        bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-lg overflow-y-auto 
        z-20 transition-all duration-300 ease-in-out
        max-h-[calc(100vh-100px)] max-w-[90vw]
      `}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
    >
      {/* Replaced Header Box */}
      <div className="
        flex justify-between items-center p-3 
        border-b border-gray-200 dark:border-gray-700
        sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10
      ">
        {/* Replaced Typography */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Network Analytics
        </h2>
        {/* Replaced IconButton */}
        <button 
          onClick={onClose} 
          className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close analytics"
        >
          <CloseIcon />
        </button>
      </div>
      
      {/* Replaced Content Box */}
      <div className="p-4 space-y-4">
        {/* Basic Statistics */}
        <div> {/* Replaced Box */}
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Overview</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300"> {/* Replaced Box & Typography */}
            <p><strong className="font-medium">Nodes:</strong> {stats.nodeCount}</p>
            <p><strong className="font-medium">Connections:</strong> {stats.linkCount}</p>
            <p><strong className="font-medium">Network Density:</strong> {formatNumber(stats.density, 3)}</p>
          </div>
        </div>
        
        {/* Top Connected Nodes */}
        {stats.topConnectedNodes.length > 0 && (
          <div> {/* Replaced Box */}
             <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Most Connected Nodes</h3>
            <div className="space-y-2"> {/* Replaced Box */}
              {stats.topConnectedNodes.map((node, index) => {
                const progress = (node.degree / maxDegree) * 100;
                return (
                  <div key={node.id}> {/* Replaced Box */}
                    {/* Replaced Box & Typography */}
                    <div className="flex justify-between items-center text-xs mb-0.5">
                      <span className="text-gray-700 dark:text-gray-300 truncate pr-2">{index + 1}. {node.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{node.degree}</span>
                    </div>
                    {/* Replaced LinearProgress */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-sky-400 to-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Communities */}
        {Object.keys(stats.communities).length > 0 && (
          <>
            <hr className="border-gray-200 dark:border-gray-600" /> {/* Replaced Divider */}
            <div> {/* Replaced Box */}
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Community Distribution</h3>
              <div className="space-y-2"> {/* Replaced Box */}
                {Object.entries(stats.communities)
                  .sort((a, b) => b[1] - a[1]) // Sort by count desc
                  .map(([communityId, count]) => {
                    const progress = (count / maxCommunitySize) * 100;
                    return (
                      <div key={communityId}> {/* Replaced Box */}
                        {/* Replaced Box & Typography */}
                        <div className="flex justify-between items-center text-xs mb-0.5">
                          <span className="text-gray-700 dark:text-gray-300">Community {communityId}</span>
                          <span className="text-gray-500 dark:text-gray-400">{count} nodes</span>
                        </div>
                        {/* Replaced LinearProgress */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-pink-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
        
        {/* Relation Types */}
        {Object.keys(stats.relationTypes).length > 0 && (
          <>
            <hr className="border-gray-200 dark:border-gray-600" /> {/* Replaced Divider */}
            <div> {/* Replaced Box */}
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Relation Types</h3>
              <div className="space-y-2"> {/* Replaced Box */}
                {Object.entries(stats.relationTypes)
                  .sort((a, b) => b[1] - a[1]) // Sort by count desc
                  .map(([type, count]) => {
                    const progress = (count / maxRelationCount) * 100;
                    return (
                      <div key={type}> {/* Replaced Box */}
                        {/* Replaced Box & Typography */}
                        <div className="flex justify-between items-center text-xs mb-0.5">
                          <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                          <span className="text-gray-500 dark:text-gray-400">{count} links</span>
                        </div>
                        {/* Replaced LinearProgress */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
