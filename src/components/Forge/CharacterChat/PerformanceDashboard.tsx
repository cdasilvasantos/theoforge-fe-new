'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, AreaChart, Area } from 'recharts';
import { Clock, Activity, ZapOff, AlertTriangle, Zap, CheckCircle, XCircle } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  count: number;
  min: number;
  max: number;
  success: number;
  error: number;
  timestamp: number;
}

interface ApiResponse {
  success: boolean;
  latency: number;
  quota: number;
  timestamp: number;
}

interface PerformanceDashboardProps {
  isVisible: boolean;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ isVisible }) => {
  const [metrics, setMetrics] = useState<Record<string, PerformanceMetric>>({});
  const [apiResponses, setApiResponses] = useState<ApiResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'storage' | 'rendering'>('overview');

  // Subscribe to performance events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePerformanceEvent = (event: CustomEvent) => {
      const { detail } = event;
      
      if (detail.type === 'measurement') {
        setMetrics(prev => {
          const name = detail.name;
          const duration = detail.duration;
          const success = detail.success ? 1 : 0;
          const error = detail.success ? 0 : 1;
          
          const existing = prev[name] || { 
            name, 
            value: 0, 
            count: 0, 
            min: Number.MAX_VALUE, 
            max: 0,
            success: 0,
            error: 0,
            timestamp: Date.now()
          };
          
          return {
            ...prev,
            [name]: {
              ...existing,
              value: (existing.value * existing.count + duration) / (existing.count + 1),
              count: existing.count + 1,
              min: Math.min(existing.min, duration),
              max: Math.max(existing.max, duration),
              success: existing.success + success,
              error: existing.error + error,
              timestamp: Date.now()
            }
          };
        });
      } else if (detail.type === 'api') {
        setApiResponses(prev => [
          ...prev.slice(-99), // Keep last 100 responses
          {
            success: detail.success,
            latency: detail.latency,
            quota: detail.quota || 1,
            timestamp: Date.now()
          }
        ]);
      }
    };

    // Register event listener
    window.addEventListener('performance-event', handlePerformanceEvent as EventListener);
    
    return () => {
      window.removeEventListener('performance-event', handlePerformanceEvent as EventListener);
    };
  }, []);

  // Prepare chart data
  const metricsChartData = useMemo(() => {
    return Object.values(metrics)
      .filter(m => m.count > 0)
      .sort((a, b) => b.value - a.value);
  }, [metrics]);

  // API response time chart data
  const apiChartData = useMemo(() => {
    return apiResponses.map((response, index) => ({
      name: index,
      latency: response.latency,
      success: response.success ? 1 : 0,
      quota: response.quota,
      timestamp: response.timestamp
    }));
  }, [apiResponses]);

  // Calculate overall health metrics
  const healthMetrics = useMemo(() => {
    const totalApiRequests = apiResponses.length;
    const successfulRequests = apiResponses.filter(r => r.success).length;
    const averageLatency = apiResponses.length > 0
      ? apiResponses.reduce((sum, r) => sum + r.latency, 0) / totalApiRequests
      : 0;
    
    // Calculate storage metrics
    const storageMetrics = Object.values(metrics).filter(m => 
      m.name.startsWith('storage_')
    );
    const averageStorageTime = storageMetrics.length > 0
      ? storageMetrics.reduce((sum, m) => sum + m.value, 0) / storageMetrics.length
      : 0;
    
    // Calculate rendering metrics
    const renderingMetrics = Object.values(metrics).filter(m => 
      m.name === 'message_render' || m.name.includes('_render')
    );
    const averageRenderTime = renderingMetrics.length > 0
      ? renderingMetrics.reduce((sum, m) => sum + m.value, 0) / renderingMetrics.length
      : 0;
    
    return {
      successRate: totalApiRequests > 0 ? (successfulRequests / totalApiRequests) * 100 : 100,
      averageLatency,
      averageStorageTime,
      averageRenderTime,
      totalApiRequests,
      totalStorageOperations: storageMetrics.reduce((sum, m) => sum + m.count, 0),
      totalRenderOperations: renderingMetrics.reduce((sum, m) => sum + m.count, 0)
    };
  }, [apiResponses, metrics]);

  if (!isVisible) return null;
  
  return (
    <div className="performance-dashboard bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 overflow-hidden">
      <div className="dashboard-header flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Activity className="mr-2" /> 
          Performance Monitoring
        </h2>
        <div className="tabs flex space-x-2">
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'api' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => setActiveTab('api')}
          >
            API
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'storage' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => setActiveTab('storage')}
          >
            Storage
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'rendering' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            onClick={() => setActiveTab('rendering')}
          >
            Rendering
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <div className="overview-tab">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">API Success Rate</h3>
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.successRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{healthMetrics.totalApiRequests} requests</p>
            </div>
            
            <div className="stat-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg. Response Time</h3>
                <Clock size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.averageLatency.toFixed(0)}ms</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">API latency</p>
            </div>
            
            <div className="stat-card bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Storage Operations</h3>
                <Zap size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.averageStorageTime.toFixed(0)}ms</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{healthMetrics.totalStorageOperations} operations</p>
            </div>
            
            <div className="stat-card bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Rendering Time</h3>
                <Activity size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.averageRenderTime.toFixed(0)}ms</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{healthMetrics.totalRenderOperations} renders</p>
            </div>
          </div>
          
          <div className="dashboard-chart h-64 mb-6">
            <h3 className="text-sm font-medium mb-2">Performance Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metricsChartData.slice(0, 10)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Avg. Duration']}
                  labelFormatter={(name: string) => `Operation: ${name}`}
                />
                <Legend />
                <Bar name="Avg. Duration (ms)" dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="dashboard-chart h-64">
            <h3 className="text-sm font-medium mb-2">API Response Time Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={apiChartData.slice(-30)} // Show last 30 requests
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Latency']}
                  labelFormatter={(name: string) => `Request #${name}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  name="Response Time (ms)" 
                  dataKey="latency" 
                  stroke="#82ca9d" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {activeTab === 'api' && (
        <div className="api-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Success Rate</h3>
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.successRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{healthMetrics.totalApiRequests} requests</p>
            </div>
            
            <div className="stat-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg. Latency</h3>
                <Clock size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.averageLatency.toFixed(0)}ms</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">API response time</p>
            </div>
            
            <div className="stat-card bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Error Rate</h3>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <p className="text-2xl font-bold">{(100 - healthMetrics.successRate).toFixed(1)}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{apiResponses.filter(r => !r.success).length} errors</p>
            </div>
          </div>
          
          <div className="dashboard-chart h-64 mb-6">
            <h3 className="text-sm font-medium mb-2">API Latency Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={apiChartData.slice(-50)} // Show last 50 requests
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Latency']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  name="Response Time" 
                  dataKey="latency" 
                  stroke="#82ca9d" 
                  dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="dashboard-chart h-64">
            <h3 className="text-sm font-medium mb-2">API Success vs Failures</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={apiChartData.slice(-50)} // Show last 50 requests
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="success" 
                  name="Success" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                />
                <Area 
                  type="monotone" 
                  dataKey="quota" 
                  name="Quota Usage" 
                  stackId="2"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {activeTab === 'storage' && (
        <div className="storage-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat-card bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg. Storage Time</h3>
                <Zap size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.averageStorageTime.toFixed(0)}ms</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">I/O operations</p>
            </div>
            
            <div className="stat-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Operations</h3>
                <Activity size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.totalStorageOperations}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">storage calls</p>
            </div>
            
            <div className="stat-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Worker Status</h3>
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">Active</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">storage worker</p>
            </div>
          </div>
          
          <div className="dashboard-chart h-64 mb-6">
            <h3 className="text-sm font-medium mb-2">Storage Operation Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.values(metrics)
                  .filter(m => m.name.startsWith('storage_'))
                  .sort((a, b) => b.value - a.value)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Duration']}
                />
                <Legend />
                <Bar name="Min" dataKey="min" fill="#82ca9d" />
                <Bar name="Avg" dataKey="value" fill="#8884d8" />
                <Bar name="Max" dataKey="max" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="performance-table overflow-x-auto">
            <h3 className="text-sm font-medium mb-2">Storage Operation Details</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Operation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {Object.values(metrics)
                  .filter(m => m.name.startsWith('storage_'))
                  .map((metric) => (
                    <tr key={metric.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{metric.name.replace('storage_', '')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.value.toFixed(2)}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.min.toFixed(2)}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.max.toFixed(2)}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'rendering' && (
        <div className="rendering-tab">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat-card bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg. Render Time</h3>
                <Activity size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.averageRenderTime.toFixed(0)}ms</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">UI rendering</p>
            </div>
            
            <div className="stat-card bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Renders</h3>
                <Activity size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{healthMetrics.totalRenderOperations}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">component renders</p>
            </div>
            
            <div className="stat-card bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">Message Render Avg</h3>
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold">
                {(Object.values(metrics).find(m => m.name === 'message_render')?.value || 0).toFixed(0)}ms
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per message</p>
            </div>
          </div>
          
          <div className="dashboard-chart h-64 mb-6">
            <h3 className="text-sm font-medium mb-2">Rendering Performance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.values(metrics)
                  .filter(m => m.name.includes('_render') || m.name.includes('component_'))
                  .sort((a, b) => b.value - a.value)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}ms`, 'Duration']}
                />
                <Legend />
                <Bar name="Render Time" dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="performance-table overflow-x-auto">
            <h3 className="text-sm font-medium mb-2">Component Render Details</h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {Object.values(metrics)
                  .filter(m => m.name.includes('_render') || m.name.includes('component_'))
                  .map((metric) => (
                    <tr key={metric.name}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{metric.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.value.toFixed(2)}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.min.toFixed(2)}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.max.toFixed(2)}ms</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{metric.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
