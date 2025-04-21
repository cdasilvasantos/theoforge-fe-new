'use client';

import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// Inline SVG Icons
const ShareSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.016l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);
const LinkedInSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
const TwitterSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.728-.666 1.581-.666 2.477 0 1.61.82 3.028 2.057 3.847-.76-.025-1.475-.232-2.1-.583v.06c0 2.254 1.604 4.135 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.59-.029-.87-.083.593 1.846 2.313 3.191 4.35 3.229-1.593 1.249-3.6 1.99-5.786 1.99-.376 0-.747-.022-1.112-.065 2.062 1.321 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.202-.004-.403-.012-.604.91-.658 1.7-1.479 2.323-2.4z"/>
  </svg>
);
const FacebookSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);
const EmailSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
  </svg>
);
const ContentCopySvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const CloseSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CheckSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

interface SocialShareProps {
  title: string;
  url: string;
  description: string;
  hashtags?: string[];
}

export default function SocialShare({ title, url, description, hashtags = [] }: SocialShareProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = () => {
    setShareOpen(true);
  };

  function closeModal() {
    setShareOpen(false)
  };

  // const handleClose = () => {
  //   setShareOpen(false);
  // };

  const showSnackbar = (message: string) => {
    // setSnackbarMessage(message);
    setCopySuccess(message.includes('copied')); // Basic check
    setSnackbarOpen(true);
  };

  // const handleSnackbarClose = () => {
  //   setSnackbarOpen(false);
  // };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        showSnackbar('URL copied to clipboard!');
      },
      () => {
        showSnackbar('Failed to copy URL');
      }
    );
  };

  useEffect(() => {
    if (snackbarOpen) {
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [snackbarOpen]);

  // Generate LinkedIn sharing URL with pre-populated content
  const formattedHashtags = hashtags.map(tag => tag.replace(/\s+/g, '')).join(',');
  
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`;
  
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${formattedHashtags}`;
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  
  const emailSubject = encodeURIComponent(title);
  const emailBody = encodeURIComponent(`${title}\n\n${description}\n\nRead more: ${url}`);
  const emailShareUrl = `mailto:?subject=${emailSubject}&body=${emailBody}`;

  // Generate LinkedIn post template
  const linkedinPostTemplate = `🔍 NEW INSIGHTS: ${title}\n\n${description}\n\n${hashtags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ')}\n\nRead the full article: ${url}`;

  return (
    <>
      <button 
        type="button"
        onClick={handleShare}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <ShareSvg />
        Share
      </button>

      <Transition appear show={shareOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex justify-between items-center"
                  >
                    Share This Article
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <CloseSvg />
                    </button>
                  </Dialog.Title>
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Share directly to:
                    </p>
                    <div className="flex space-x-3 mb-6">
                      <a
                        href={linkedinShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on LinkedIn"
                        aria-label="share on linkedin"
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <LinkedInSvg />
                      </a>
                      <a
                        href={twitterShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on Twitter/X"
                        aria-label="share on twitter x"
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <TwitterSvg />
                      </a>
                      <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Share on Facebook"
                        aria-label="share on facebook"
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FacebookSvg />
                      </a>
                      <a
                        href={emailShareUrl}
                        title="Share via Email"
                        aria-label="share via email"
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <EmailSvg />
                      </a>
                    </div>

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Copy Article Link:
                    </p>
                    <div className="flex mb-6">
                      <input
                        type="text"
                        readOnly
                        value={url}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className={`ml-2 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${copySuccess ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 whitespace-nowrap transition-colors`}
                      >
                        {copySuccess ? <CheckSvg/> : <ContentCopySvg/>}
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>

                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn Post Template:
                    </p>
                    <textarea
                      readOnly
                      rows={6}
                      value={linkedinPostTemplate}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Simple Snackbar Replacement */}
      <Transition
        show={snackbarOpen}
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg text-sm font-medium ${copySuccess ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'}`}>
          {/* {snackbarMessage} */}
        </div>
      </Transition>
    </>
  );
}
