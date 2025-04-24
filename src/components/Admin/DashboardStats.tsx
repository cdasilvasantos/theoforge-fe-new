'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, UserCheck, ShoppingBag, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

// API base URL
const API_BASE_URL = '/api';

// Dashboard stats interface
interface DashboardStats {
  overview: {
    totalUsers: number;
    totalGuests: number;
    verifiedUsers: number;
    adminUsers: number;
  };
  subscriptions: {
    FREE: number;
    BASIC: number;
    PREMIUM: number;
  };
  guests: {
    NEW: number;
    CONTACTED: number;
    QUALIFIED: number;
    CONVERTED: number;
  };
  activity: {
    userRegistrations: {
      date: string;
      registrations: number;
    }[];
    guestSubmissions: {
      date: string;
      submissions: number;
    }[];
  };
}

export default function DashboardStats() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          console.log('Stats fetched successfully:', response.data);
          setStats(response.data);
        } else {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard statistics...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
          <span className="text-red-800 dark:text-red-400">
            {error}
          </span>
        </div>
      </div>
    );
  }

  // If stats aren't available yet, show empty state
  if (!stats) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900/20 p-6 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No data available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Statistics will appear once users and guests are added to the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats.overview.totalUsers} 
          icon={<Users className="h-5 w-5" />}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        />
        <StatCard 
          title="Verified Users" 
          value={stats.overview.verifiedUsers} 
          percentage={stats.overview.totalUsers > 0 ? (stats.overview.verifiedUsers / stats.overview.totalUsers) * 100 : 0}
          icon={<UserCheck className="h-5 w-5" />}
          colorClass="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
        />
        <StatCard 
          title="Total Guests" 
          value={stats.overview.totalGuests} 
          icon={<Users className="h-5 w-5" />}
          colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
        />
        <StatCard 
          title="Paying Subscribers" 
          value={stats.subscriptions.BASIC + stats.subscriptions.PREMIUM} 
          percentage={stats.overview.totalUsers > 0 ? 
            ((stats.subscriptions.BASIC + stats.subscriptions.PREMIUM) / stats.overview.totalUsers) * 100 : 0}
          icon={<ShoppingBag className="h-5 w-5" />}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
        />
      </div>

      {/* Subscriptions & Guests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Subscription Distribution</h3>
          <div className="space-y-4">
            <PlanBar 
              label="Free Plan" 
              count={stats.subscriptions.FREE} 
              total={stats.overview.totalUsers} 
              colorClass="bg-gray-200 dark:bg-gray-700"
            />
            <PlanBar 
              label="Basic Plan" 
              count={stats.subscriptions.BASIC} 
              total={stats.overview.totalUsers} 
              colorClass="bg-blue-400 dark:bg-blue-600"
            />
            <PlanBar 
              label="Premium Plan" 
              count={stats.subscriptions.PREMIUM} 
              total={stats.overview.totalUsers} 
              colorClass="bg-amber-400 dark:bg-amber-600"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Guest Pipeline</h3>
          <div className="space-y-4">
            <PlanBar 
              label="New Leads" 
              count={stats.guests.NEW} 
              total={stats.overview.totalGuests} 
              colorClass="bg-blue-400 dark:bg-blue-600"
            />
            <PlanBar 
              label="Contacted" 
              count={stats.guests.CONTACTED} 
              total={stats.overview.totalGuests} 
              colorClass="bg-purple-400 dark:bg-purple-600"
            />
            <PlanBar 
              label="Qualified" 
              count={stats.guests.QUALIFIED} 
              total={stats.overview.totalGuests} 
              colorClass="bg-green-400 dark:bg-green-600"
            />
            <PlanBar 
              label="Converted" 
              count={stats.guests.CONVERTED} 
              total={stats.overview.totalGuests} 
              colorClass="bg-amber-400 dark:bg-amber-600"
            />
          </div>
        </Card>
      </div>

      {/* Activity Charts */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <Tabs defaultValue="registrations">
          <TabsList className="mb-4">
            <TabsTrigger value="registrations">User Registrations</TabsTrigger>
            <TabsTrigger value="submissions">Guest Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registrations">
            <ActivityChart data={stats.activity.userRegistrations} valueKey="registrations" label="New Users" />
          </TabsContent>
          
          <TabsContent value="submissions">
            <ActivityChart data={stats.activity.guestSubmissions} valueKey="submissions" label="New Guests" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  percentage, 
  icon, 
  colorClass 
}: { 
  title: string; 
  value: number; 
  percentage?: number; 
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
          
          {percentage !== undefined && (
            <div className="flex items-center mt-1">
              {percentage > 0 ? (
                <ChevronUp className="h-3 w-3 text-green-500" />
              ) : (
                <ChevronDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-full ${colorClass}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// Plan Bar Component
function PlanBar({ 
  label, 
  count, 
  total, 
  colorClass 
}: { 
  label: string; 
  count: number; 
  total: number;
  colorClass: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm font-medium">{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Activity Chart Component
function ActivityChart({ 
  data, 
  valueKey, 
  label 
}: { 
  data: { date: string; [key: string]: any }[]; 
  valueKey: string;
  label: string;
}) {
  // Get the last 14 days of data for better visibility
  const recentData = data.slice(-14);
  
  // Calculate max value for scaling
  const maxValue = Math.max(...recentData.map(item => item[valueKey]), 1);
  
  return (
    <div className="h-64">
      <div className="flex h-full">
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue / 2)}</span>
          <span>0</span>
        </div>
        
        {/* Chart */}
        <div className="flex-1">
          <div className="flex h-full items-end">
            {recentData.map((item, index) => {
              const height = (item[valueKey] / maxValue) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                    style={{ height: `${height}%`, minHeight: item[valueKey] > 0 ? '4px' : '0' }}
                  ></div>
                  <div className="text-xs mt-1 transform -rotate-45 origin-top-left text-gray-500">
                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* X-axis label */}
          <div className="text-center text-sm text-gray-500 mt-8">
            {label} (Last 14 days)
          </div>
        </div>
      </div>
    </div>
  );
}
