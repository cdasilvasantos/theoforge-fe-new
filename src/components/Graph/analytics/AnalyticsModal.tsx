import React, { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { PhilosopherData, GraphNode } from '@/types/graph';

interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  data: PhilosopherData;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ open, onClose, data }) => {
  const [tabValue, setTabValue] = useState(0);

  const communityColorClasses = [
    "bg-teal-600",     // Corresponds to #00796B
    "bg-blue-600",     // Corresponds to #1976D2
    "bg-orange-500",   // Corresponds to #FFA000
    "bg-purple-600",   // Corresponds to #7B1FA2
    "bg-red-700",      // Corresponds to #C62828
    "bg-yellow-700"    // Corresponds to #795548 (closest Tailwind match)
  ];

  const getCommunityColorClass = (community: number | string | undefined): string => {
    const communityStr = String(community ?? '0'); // Default undefined/null to '0'
    const communityNum = parseInt(communityStr, 10);
    const index = isNaN(communityNum) ? 0 : communityNum; // Default NaN to 0
    const nonNegativeIndex = Math.max(0, index);
    return communityColorClasses.length > 0 
      ? communityColorClasses[nonNegativeIndex % communityColorClasses.length] 
      : 'bg-gray-500'; // Default if array is empty
  };

  const calculateInfluenceRanking = () => {
    return [...data.nodes]
      .sort((a, b) => (b.influenceScore ?? 0) - (a.influenceScore ?? 0))
      .slice(0, 10);
  };

  const calculateConnectivity = () => {
    const connectivity: Record<string, number> = {};
    
    data.nodes.forEach(node => {
      connectivity[node.id] = 0;
    });
    
    data.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? (link.source as GraphNode).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as GraphNode).id : link.target;
      
      if (connectivity[sourceId] !== undefined) {
        connectivity[sourceId]++;
      }
      if (connectivity[targetId] !== undefined) {
        connectivity[targetId]++;
      }
    });
    
    return Object.entries(connectivity)
      .map(([id, count]) => ({
        id,
        name: data.nodes.find(node => node.id === id)?.name || id,
        connections: count
      }))
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 10);
  };

  const calculateEraCounts = () => {
    const eraCounts: { [key: string]: number } = {};
    
    data.nodes.forEach(node => {
      if (node.era) { // Only increment if era is defined
        eraCounts[node.era] = (eraCounts[node.era] || 0) + 1;
      }
    });
    
    return Object.entries(eraCounts)
      .map(([era, count]) => ({ era, count }))
      .sort((a, b) => b.count - a.count);
  };

  const influenceRanking = calculateInfluenceRanking();
  const connectivity = calculateConnectivity();
  const eraCounts = calculateEraCounts();

  return (
    <Dialog as="div" className="relative z-10" open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel 
          className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all"
        >
          <Dialog.Title
            as="h3"
            className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100 p-4 border-b border-gray-200 dark:border-gray-700"
          >
            Philosophical Network Analysis
          </Dialog.Title>
          
          <Tab.Group selectedIndex={tabValue} onChange={setTabValue}>
            <Tab.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 px-4">
              {['Executive Summary', 'Influence Metrics', 'Network Insights'].map((tabName) => (
                <Tab
                  key={tabName}
                  className={({ selected }) =>
                    `w-full py-2.5 text-sm font-medium leading-5 rounded-t-md
                    focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                    ${ selected
                        ? 'text-blue-700 dark:text-blue-300 border-b-2 border-blue-500'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                    }`
                  }
                >
                  {tabName}
                </Tab>
              ))}
            </Tab.List>
            
            <Tab.Panels className="mt-2 p-4">
              <Tab.Panel className="focus:outline-none">
                <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Key Findings
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  This network analysis reveals the complex interconnections between {data.nodes.length} major philosophers across different eras of history. 
                  The visualization demonstrates how ideas have propagated through time, with clear influence patterns emerging.
                </p>
                
                <div className="mb-6">
                  <h5 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                    Most Influential Philosophers (Top 5)
                  </h5>
                  <ul className="space-y-3">
                    {influenceRanking.slice(0, 5).map((philosopher, index) => (
                      <li key={philosopher.id} className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full ${getCommunityColorClass(philosopher.community)} flex items-center justify-center text-white text-xs font-semibold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{philosopher.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Influence: {philosopher.influenceScore?.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-1/3 md:w-2/5">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getCommunityColorClass(philosopher.community)}`}
                              style={{ width: `${((philosopher.influenceScore ?? 0) / (influenceRanking[0]?.influenceScore ?? 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                    Era Distribution
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {eraCounts.map(({ era, count }) => (
                      <div 
                        key={era}
                        className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 min-w-[100px] text-center shadow-sm"
                      >
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {era}
                        </p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">
                          {count}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>
              
              <Tab.Panel className="focus:outline-none">
                <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Influence Ranking (Top 10)
                </h4>
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th scope="col" className="py-3 px-4 w-16">Rank</th>
                        <th scope="col" className="py-3 px-4">Philosopher</th>
                        <th scope="col" className="py-3 px-4">Era</th>
                        <th scope="col" className="py-3 px-4">Community</th>
                        <th scope="col" className="py-3 px-4 text-right">Influence Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {influenceRanking.map((philosopher, index) => (
                        <tr key={philosopher.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{philosopher.name}</td>
                          <td className="py-3 px-4">{philosopher.era}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className={`inline-block w-3 h-3 mr-1.5 rounded-full ${getCommunityColorClass(philosopher.community)}`}></span>
                              {philosopher.community}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">{philosopher.influenceScore?.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              
              <Tab.Panel className="focus:outline-none">
                <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Network Statistics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Top Connected Philosophers (Top 10)</h5>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                          <tr>
                            <th scope="col" className="py-2 px-3 w-12">Rank</th>
                            <th scope="col" className="py-2 px-3">Philosopher</th>
                            <th scope="col" className="py-2 px-3 text-right">Connections</th>
                          </tr>
                        </thead>
                        <tbody>
                          {connectivity.map((item, index) => (
                            <tr key={item.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                              <td className="py-2 px-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{item.name}</td>
                              <td className="py-2 px-3 text-right font-mono">{item.connections}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Philosophers per Era</h5>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                          <tr>
                            <th scope="col" className="py-2 px-3">Era</th>
                            <th scope="col" className="py-2 px-3 text-right">Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eraCounts.map(({ era, count }) => (
                            <tr key={era} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <td className="py-2 px-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{era}</td>
                              <td className="py-2 px-3 text-right font-mono">{count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-800 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-150"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AnalyticsModal;
