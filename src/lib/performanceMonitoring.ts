/**
 * Performance Monitoring System
 * 
 * Provides utilities for measuring and tracking application performance
 * with support for custom markers, measurements, and reporting.
 */

// Define interfaces for performance data
export interface PerformanceMetadata {
  component?: string;
  action?: string;
  context?: Record<string, any>;
  characterName?: string;
  messageLength?: number;
  endpoint?: string;
  error?: boolean;
  errorType?: string;
  success?: boolean;
  rateLimit?: boolean;
  validationError?: boolean;
  characterId?: string;
  streaming?: boolean;
  [key: string]: any; // Allow additional properties for flexibility
}

export interface PerformanceMeasurement {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: PerformanceMetadata;
}

// In-memory cache of measurements for analysis
const measurementCache: PerformanceMeasurement[] = [];

// Maximum number of measurements to keep in memory
const MAX_CACHED_MEASUREMENTS = 100;

/**
 * Start a performance measurement
 * 
 * @param label - Identifier for the measurement
 * @param data - Additional metadata for the measurement
 * @returns The mark name
 */
export const startMeasurement = (label: string, data: PerformanceMetadata = {}): string => {
  if (typeof performance !== 'undefined' && performance.mark) {
    const markName = `${label}-start`;
    
    try {
      // Use modern performance.mark with detailed data
      performance.mark(markName, { detail: data });
    } catch (e) {
      // Fallback for browsers that don't support detailed marks
      performance.mark(markName);
    }
    
    return markName;
  }
  
  // Fallback for environments without performance API
  return `${label}-start-${Date.now()}`;
};

/**
 * End a performance measurement and record results
 * 
 * @param startMarkName - The name returned from startMeasurement
 * @param options - Additional options for the measurement
 * @returns The duration in milliseconds, or null if measurement failed
 */
export const endMeasurement = (
  startMarkName: string, 
  options?: {
    reportToAnalytics?: boolean;
    metadata?: PerformanceMetadata;
  }
): number | null => {
  // If not a valid start mark or no performance API, return null
  if (!startMarkName || typeof performance === 'undefined') {
    return null;
  }
  
  try {
    const measureName = startMarkName.replace('-start', '');
    
    // Check if using the fallback system (no performance API)
    if (startMarkName.includes('-start-') && !performance.mark) {
      const startTime = parseInt(startMarkName.split('-start-')[1], 10);
      const duration = Date.now() - startTime;
      
      // Record measurement in cache
      recordMeasurement(measureName, duration, options?.metadata);
      
      return duration;
    }
    
    // Using the performance API
    if (performance.measure) {
      performance.measure(measureName, startMarkName);
      
      // Get the measurement result
      const measurements = performance.getEntriesByName(measureName, 'measure');
      const measurement = measurements[measurements.length - 1];
      
      if (measurement) {
        // Record measurement in cache
        recordMeasurement(measureName, measurement.duration, options?.metadata);
        
        // Send to analytics if configured
        if (options?.reportToAnalytics) {
          reportPerformanceMetric(measureName, measurement.duration, options?.metadata);
        }
        
        return measurement.duration;
      }
    }
  } catch (error) {
    console.error('Error in performance measurement:', error);
  }
  
  return null;
};

/**
 * Record a measurement in the in-memory cache
 */
const recordMeasurement = (
  name: string, 
  duration: number, 
  metadata?: PerformanceMetadata
): void => {
  // Add to the cache
  measurementCache.unshift({
    name,
    duration,
    timestamp: Date.now(),
    metadata
  });
  
  // Trim the cache if it gets too big
  if (measurementCache.length > MAX_CACHED_MEASUREMENTS) {
    measurementCache.pop();
  }
};

/**
 * Report a performance metric to an analytics service
 */
const reportPerformanceMetric = (
  name: string, 
  duration: number, 
  metadata?: PerformanceMetadata
): void => {
  // In a production environment, this would send data to an analytics service
  // For now, just log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`, metadata);
  }
  
  // Here you would integrate with your analytics service:
  // analyticsService.trackPerformance(name, duration, metadata);
};

/**
 * Get the recent performance measurements
 */
export const getRecentMeasurements = (): PerformanceMeasurement[] => {
  return [...measurementCache];
};

/**
 * Clear all performance marks and measures
 */
export const clearPerformanceMarks = (): void => {
  if (typeof performance !== 'undefined') {
    if (performance.clearMarks) performance.clearMarks();
    if (performance.clearMeasures) performance.clearMeasures();
  }
};

/**
 * Measure the execution time of a function
 */
export const measureExecution = async <T>(
  fn: () => T | Promise<T>,
  label: string,
  metadata?: PerformanceMetadata
): Promise<T> => {
  const markName = startMeasurement(label, metadata);
  
  try {
    const result = await fn();
    endMeasurement(markName, { metadata });
    return result;
  } catch (error) {
    endMeasurement(markName, { 
      metadata: { ...metadata, error: true, errorMessage: String(error) }
    });
    throw error;
  }
};
