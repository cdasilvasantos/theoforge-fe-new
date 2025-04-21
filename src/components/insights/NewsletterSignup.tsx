'use client';

import React, { useState, Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import Button from '../Common/Button';

// Inline SVG Icon for Mail
const MailOutlineSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
  title?: string;
  subtitle?: string;
}

export default function NewsletterSignup({ 
  variant = 'card', 
  title = 'Gain Strategic AI Insights',
  subtitle = 'Receive expert analysis and practical guidance on AI transformation directly in your inbox.'
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string, consent?: string }>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    } else {
      setFieldErrors(prev => ({ ...prev, email: undefined }));
    }
    
    // Validate consent
    if (!consent) {
      setFieldErrors(prev => ({ ...prev, consent: 'Please agree to receive communications' }));
      return;
    } else {
      setFieldErrors(prev => ({ ...prev, consent: undefined }));
    }
    
    // Clear general error if validation passes
    setError(null); 
    setFieldErrors({});
    
    // In a real implementation, you would send this data to your API
    console.log('Newsletter signup:', { email, name, consent });
    
    // Show success message
    setSuccess(true);
    
    // Reset form
    setEmail('');
    setName('');
    setConsent(false);
    setError(null);
    setFieldErrors({});
  };

  // Snackbar close logic handled by useEffect
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 6000); // Hide after 6 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  const content = (
    <>
      <div className="mb-4">
        <h3 className={`${variant === 'card' ? 'text-xl' : 'text-lg'} font-semibold text-gray-900 dark:text-white mb-1`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-3"
      >
        <div>
          <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${fieldErrors.email ? 'border-red-500 dark:border-red-400' : ''} ${variant === 'inline' ? 'py-1.5 px-2 text-sm' : 'py-2 px-3'}`}
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors(prev => ({...prev, email: undefined}));
            }}
            aria-describedby="email-error"
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600 dark:text-red-400" id="email-error">{fieldErrors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="newsletter-name" className="sr-only">Name (Optional)</label>
          <input
            id="newsletter-name"
            name="name"
            type="text"
            autoComplete="name"
            className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white ${variant === 'inline' ? 'py-1.5 px-2 text-sm' : 'py-2 px-3'}`}
            placeholder="Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="relative flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="newsletter-consent"
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className={`h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:checked:bg-blue-500 ${fieldErrors.consent ? 'border-red-500 dark:border-red-400' : ''}`}
              aria-describedby="consent-error"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="newsletter-consent" className="text-gray-600 dark:text-gray-400">
              I agree to receive email communications from TheoForge about industry insights, events, and services.
            </label>
            {fieldErrors.consent && <p className="mt-1 text-xs text-red-600 dark:text-red-400" id="consent-error">{fieldErrors.consent}</p>}
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        
        <Button 
          type="submit"
          variant="primary"
          size="sm"
          leftIcon={<MailOutlineSvg />}
          className={`w-full mt-1 ${variant === 'card' ? 'rounded-lg' : 'rounded-md'}`}
        >
          Subscribe
        </Button>
      </form>
      
      {/* Snackbar Replacement */}
      <Transition
        show={success}
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
          Thanks for subscribing! Please check your email to confirm your subscription.
        </div>
      </Transition>
    </>
  );

  if (variant === 'card') {
    return (
      <div
        className="p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
      >
        {content}
      </div>
    );
  }

  return content;
}
