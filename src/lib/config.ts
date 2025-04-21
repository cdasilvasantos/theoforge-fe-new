// Environment configuration

// Runtime environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Base URL configuration with dynamic port detection
// This handles cases where Next.js changes ports automatically (3000 → 3001 → 3002)
export const getBaseUrl = (): string => {
  // In browser context, use window.location
  if (typeof window !== 'undefined') {
    const location = window.location;
    return `${location.protocol}//${location.host}`;
  }
  
  // In server context, use environment variable with fallback
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

// API endpoints
export const apiEndpoints = {
  characters: () => `${getBaseUrl()}/api/characters`,
  characterChat: () => `${getBaseUrl()}/api/characters/chat`,
  characterDetails: (id: string) => `${getBaseUrl()}/api/characters/${id}`,
  externalChat: () => process.env.CHARACTER_API_URL ? `${process.env.CHARACTER_API_URL}/chat` : null
};

// Get API keys from environment variables
export const openAIApiKey = process.env.OPENAI_API_KEY || '';
export const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';

// Validate that required API keys are available
export function validateEnvironment(): boolean {
  const requiredVars = [
    { name: 'OPENAI_API_KEY', value: openAIApiKey }
  ];
  
  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', 
      missingVars.map(v => v.name).join(', '));
    return false;
  }
  
  return true;
}

// Configuration for LLM models
export const llmConfig = {
  provider: process.env.LLM_PROVIDER || 'openai',
  defaultModel: process.env.LLM_MODEL || 'gpt-3.5-turbo',
  temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000', 10),
  useRealLLM: process.env.ENABLE_REAL_LLM === 'true'
};

// Application configuration
export const appConfig = {
  isDevelopment,
  isProduction,
  isTest,
  characterDefaultImagePath: '/characters/images/default-avatar.png',
  maxMessagesInConversation: 100,
  defaultTitle: 'TheoForge Character Chat',
  // Timeouts and retries
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
  retryDelay: 1000, // 1 second
};

// Diagnostics and logging configuration
export const diagnosticsConfig = {
  // Controls level of detail in logs
  logLevel: isDevelopment ? 'debug' : 'error',
  // Whether to log API calls to console
  logApiCalls: isDevelopment,
  // Whether to send performance metrics to analytics
  reportPerformanceToAnalytics: isProduction,
};

// Export a debug function that respects current log level
export const debug = (message: string, data?: any): void => {
  if (diagnosticsConfig.logLevel === 'debug') {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

// Simplified logging for info level logs
export const info = (message: string, data?: any): void => {
  console.log(`[INFO] ${message}`, data ? data : '');
};
