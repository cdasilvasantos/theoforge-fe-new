/**
 * Performance Metrics
 * 
 * Comprehensive performance monitoring system that tracks:
 * - Component render timing
 * - API response times
 * - Memory usage patterns
 * - Interaction latency
 * - Event loop blockage
 */

import React, { useEffect, useRef, DependencyList, ComponentType, FC } from 'react';

interface PerformanceMark {
  name: string;
  startTime: number;
  metadata: Record<string, any>;
  thresholds?: {
    warning: number; // milliseconds that trigger a warning
    critical: number; // milliseconds that trigger a critical alert
  };
}

interface PerformanceMeasurement {
  name: string;
  duration: number;
  metadata: Record<string, any>;
  timestamp: number;
}

// Enhanced type for long task attribution
interface LongTaskAttribution {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  containerType?: string;
  containerName?: string;
  containerId?: string;
}

interface LongTaskEntry extends PerformanceEntry {
  attribution?: LongTaskAttribution[];
}

// Constants for thresholds
const DEFAULT_THRESHOLDS = {
  warning: 100, // 100ms is noticeable by users
  critical: 300  // 300ms is disruptive to user experience
};

// Set up a singleton to track all performance data
class PerformanceMonitor {
  private marks = new Map<string, PerformanceMark>();
  private measurements: PerformanceMeasurement[] = [];
  private isEnabled: boolean = process.env.NODE_ENV !== 'production' || !!process.env.ENABLE_PERFORMANCE_MONITORING;
  private longTaskObserver: PerformanceObserver | null = null;
  private framesThreshold = 3; // Number of dropped frames to consider as jank
  private lastFrameTime = 0;
  private droppedFrames = 0;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.setupLongTaskObserver();
      this.setupFrameMonitoring();
    }
  }

  /**
   * Start tracking a performance mark
   */
  start(name: string, metadata: Record<string, any> = {}, thresholds?: { warning: number; critical: number }): string {
    if (!this.isEnabled) return name;
    
    const id = `${name}_${Date.now()}`;
    this.marks.set(id, {
      name,
      startTime: performance.now(),
      metadata,
      thresholds: thresholds || DEFAULT_THRESHOLDS
    });
    
    return id;
  }

  /**
   * End tracking and record the measurement
   */
  end(id: string): number | null {
    if (!this.isEnabled || !this.marks.has(id)) return null;
    
    const mark = this.marks.get(id)!;
    const endTime = performance.now();
    const duration = endTime - mark.startTime;
    
    // Record the measurement
    const measurement: PerformanceMeasurement = {
      name: mark.name,
      duration,
      metadata: mark.metadata,
      timestamp: Date.now()
    };
    
    this.measurements.push(measurement);
    
    // Check against thresholds
    if (mark.thresholds) {
      if (duration >= mark.thresholds.critical) {
        console.warn(`CRITICAL PERFORMANCE ISSUE: ${mark.name} took ${duration.toFixed(2)}ms`, mark.metadata);
        this.reportPerformanceIssue(measurement, 'critical');
      } else if (duration >= mark.thresholds.warning) {
        console.warn(`PERFORMANCE WARNING: ${mark.name} took ${duration.toFixed(2)}ms`, mark.metadata);
        this.reportPerformanceIssue(measurement, 'warning');
      }
    }
    
    // Clean up the mark
    this.marks.delete(id);
    
    return duration;
  }

  /**
   * Measure a function execution time
   */
  measure<T>(name: string, fn: () => T, metadata: Record<string, any> = {}): T {
    const id = this.start(name, metadata);
    try {
      return fn();
    } finally {
      this.end(id);
    }
  }

  /**
   * Measure an async function execution time
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>, metadata: Record<string, any> = {}): Promise<T> {
    const id = this.start(name, metadata);
    try {
      return await fn();
    } finally {
      this.end(id);
    }
  }

  /**
   * Get all measurements for analysis
   */
  getMeasurements(): PerformanceMeasurement[] {
    return [...this.measurements];
  }

  /**
   * Clear all stored measurements (e.g., after reporting)
   */
  clearMeasurements(): void {
    this.measurements = [];
  }

  /**
   * Setup observer for long tasks that block the main thread
   */
  private setupLongTaskObserver(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
    
    try {
      this.longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'longtask') {
            const longTaskEntry = entry as LongTaskEntry;
            const duration = entry.duration;
            console.warn(`Main thread blocked for ${duration.toFixed(2)}ms`);
            
            // Record as a special type of measurement
            this.measurements.push({
              name: 'main_thread_blocked',
              duration,
              metadata: {
                attribution: longTaskEntry.attribution && longTaskEntry.attribution[0] ? {
                  name: longTaskEntry.attribution[0].name,
                  type: longTaskEntry.attribution[0].entryType
                } : 'unknown'
              },
              timestamp: Date.now()
            });
          }
        }
      });
      
      this.longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error('PerformanceObserver for long tasks failed to initialize', e);
    }
  }

  /**
   * Monitor for dropped frames to detect UI jank
   */
  private setupFrameMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    const checkFrame = () => {
      const now = performance.now();
      if (this.lastFrameTime) {
        const delta = now - this.lastFrameTime;
        // If frame delta is more than 33.33ms (less than 30fps), consider it dropped
        if (delta > 33.33) {
          this.droppedFrames++;
          
          // Only report after multiple consecutive dropped frames
          if (this.droppedFrames >= this.framesThreshold) {
            this.measurements.push({
              name: 'dropped_frames',
              duration: delta,
              metadata: {
                count: this.droppedFrames,
                timestamp: now
              },
              timestamp: Date.now()
            });
            
            console.warn(`UI Jank detected: ${this.droppedFrames} dropped frames, ${delta.toFixed(2)}ms since last frame`);
            this.droppedFrames = 0;
          }
        } else {
          this.droppedFrames = 0;
        }
      }
      
      this.lastFrameTime = now;
      requestAnimationFrame(checkFrame);
    };
    
    requestAnimationFrame(checkFrame);
  }

  /**
   * Report performance issues to monitoring system
   * In a real app, this could send to an analytics service
   */
  private reportPerformanceIssue(measurement: PerformanceMeasurement, severity: 'warning' | 'critical'): void {
    // In development, just log to console
    if (process.env.NODE_ENV !== 'production') return;
    
    // In production, could send to an analytics service
    // Example: sendToAnalytics('performance_issue', {
    //   ...measurement,
    //   severity
    // });
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// HOCs and hooks for React components
export function withPerformanceTracking<P extends object>(
  Component: ComponentType<P>,
  componentName?: string
): React.FC<P> {
  const displayName = componentName || Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props: P) => {
    const markRef = useRef<string>('');
    
    useEffect(() => {
      markRef.current = performanceMonitor.start(`component_${displayName}`, {
        props: Object.keys(props).length
      });
      
      return () => {
        if (markRef.current) {
          performanceMonitor.end(markRef.current);
        }
      };
    }, [props]);
    
    // Properly typed with generic props
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `WithPerformanceTracking(${displayName})`;
  return WrappedComponent;
}

// React hook for component performance tracking
export function usePerformanceTracking(componentName: string, deps: DependencyList = []) {
  useEffect(() => {
    const id = performanceMonitor.start(`component_${componentName}`, {
      dependencies: deps.length
    });
    
    return () => {
      performanceMonitor.end(id);
    };
  }, deps);
}
