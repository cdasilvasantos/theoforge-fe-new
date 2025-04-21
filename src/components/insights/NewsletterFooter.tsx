import React from 'react';
import Button from '../Common/Button';

// Inline SVG for Email Icon
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

// Inline SVG for Send Icon
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3.105 3.105a1.25 1.25 0 011.768 0l11.029 11.028a1.25 1.25 0 010 1.768l-2.063 2.062a1.25 1.25 0 01-1.768 0L1.04 6.934a1.25 1.25 0 010-1.768L3.105 3.105z" />
    <path d="M5.293 4.23l9.91 9.91 1.06-1.06-9.91-9.91-1.06 1.06zM12.23 3.105l1.06 1.06-4.038 4.038-1.06-1.06L12.23 3.105zM17.895 8.77l-4.038 4.038-1.06-1.06 4.038-4.038 1.06 1.06z" />
  </svg>
);

const NewsletterFooter: React.FC = () => {
  return (
    <section
      className="p-8 rounded-lg bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-medium mb-2 text-gray-900 dark:text-white">
          Stay Ahead with TheoForge Insights
        </h3>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Subscribe for strategic insights on navigating AI complexity, delivered directly to your inbox.
        </p>
        
        <form
          className="flex flex-col sm:flex-row gap-2 w-full"
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EmailIcon /> 
            </div>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         text-gray-900 dark:text-white bg-white dark:bg-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full sm:w-auto"
            rightIcon={<SendIcon />}
          >
            Subscribe
          </Button>
        </form>
        
        <p className="block mt-4 text-xs text-gray-500 dark:text-gray-400">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default NewsletterFooter;
