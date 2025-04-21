/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make API keys available to client-side code if needed
    // Be careful not to expose sensitive keys to the client
  },
  // Include environment variables that should be accessible to server components and API routes
  serverRuntimeConfig: {
    // Server-only config (not exposed to the browser)
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC: process.env.ANTHROPIC,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add API route rewriting to handle CORS issues in development
  async rewrites() {
    return [
      // Specific rule for guests endpoint with exact path
      {
        source: '/api/guests/',
        destination: 'http://dev.theoforge.com/API/guests/',
      },
      // Specific rule for guests endpoint with path parameters
      {
        source: '/api/guests/:path*',
        destination: 'http://dev.theoforge.com/API/guests/:path*',
      },
      // General rule for other API paths
      {
        source: '/api/:path*',
        destination: 'http://dev.theoforge.com/API/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
