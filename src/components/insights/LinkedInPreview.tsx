'use client';

import React, { useState, useEffect } from 'react';
import { PostData } from '@/types/post';

interface LinkedInPreviewProps {
  post: PostData;
  baseUrl: string;
}

export default function LinkedInPreview({ post, baseUrl }: LinkedInPreviewProps) {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
      },
      () => {
        setSnackbarMessage('Failed to copy');
        setSnackbarOpen(true);
      }
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Auto-close snackbar
  useEffect(() => {
    if (snackbarOpen) {
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbarOpen]);

  // Generate LinkedIn post templates
  const generateStandardPost = () => {
    const hashtags = post.tags 
      ? post.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') 
      : '';
    
    const isPodcast = post.isPodcast ? `🎙️ NEW PODCAST EPISODE${post.podcastEpisodeNumber ? ` #${post.podcastEpisodeNumber}` : ''}` : '📝 NEW ARTICLE';
    
    return `${isPodcast}: ${post.title}\n\n${post.excerpt}\n\n${hashtags}\n\nRead the full ${post.isPodcast ? 'episode transcript' : 'article'}: ${baseUrl}/blog/${post.slug}`;
  };

  const generateExecutivePost = () => {
    const hashtags = post.tags 
      ? post.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') 
      : '';
    
    return `🔍 EXECUTIVE INSIGHT: ${post.title}\n\nAs enterprise leaders navigate the rapidly evolving AI landscape, understanding ${post.tags?.[0] || 'strategic approaches'} becomes increasingly critical.\n\nIn our latest ${post.isPodcast ? 'podcast episode' : 'article'}, we explore:\n\n• Key insights on ${post.tags?.[0] || 'AI strategy'}\n• Practical implementation approaches\n• How to measure success and avoid common pitfalls\n\n${hashtags}\n\nRead more: ${baseUrl}/blog/${post.slug}`;
  };

  const generateThoughtLeadershipPost = () => {
    const hashtags = post.tags 
      ? post.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') 
      : '';
    
    return `🧠 THOUGHT LEADERSHIP: ${post.title}\n\nI'm excited to share our latest perspective on ${post.tags?.[0] || 'enterprise AI strategy'}.\n\n"${post.excerpt.split('.')[0]}." ${post.excerpt.split('.').slice(1, 2).join('.')}.\n\nThis ${post.isPodcast ? 'podcast episode' : 'article'} is particularly relevant for:\n• CTOs and technology leaders\n• Enterprise architects\n• Digital transformation teams\n\n${hashtags}\n\nFull ${post.isPodcast ? 'episode' : 'article'}: ${baseUrl}/blog/${post.slug}`;
  };

  const standardPost = generateStandardPost();
  const executivePost = generateExecutivePost();
  const thoughtLeadershipPost = generateThoughtLeadershipPost();

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseUrl}/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt)}`;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="mr-2">LI</span> 
        LinkedIn Toolkit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">LinkedIn Publishing Toolkit</h2>
              <button
                type="button"
                aria-label="close"
                onClick={handleClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <p className="text-base text-gray-600 mb-4">
                Promote your content to maximize engagement and establish thought leadership
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <p className="text-sm text-gray-700">
                  Share this {post.isPodcast ? 'podcast episode' : 'article'} directly to LinkedIn:
                </p>
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 border border-blue-600 text-xs font-medium rounded text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="mr-1">LI</span>
                  Share on LinkedIn
                  <span className="ml-1">↗</span>
                </a>
              </div>

              <div className="border-t border-gray-200 mb-5"></div>

              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                LinkedIn Post Templates
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Choose a template that matches your audience and objectives. Copy and customize as needed.
              </p>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-md font-semibold text-gray-700">Standard Announcement</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(standardPost, 'Standard post copied to clipboard!')}
                    className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="mr-1">📄</span> Copy
                  </button>
                </div>
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50 whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {standardPost}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-md font-semibold text-gray-700">Executive Audience Focus</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(executivePost, 'Executive post copied to clipboard!')}
                    className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="mr-1">📄</span> Copy
                  </button>
                </div>
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50 whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {executivePost}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-md font-semibold text-gray-700">Thought Leadership Position</h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(thoughtLeadershipPost, 'Thought leadership post copied to clipboard!')}
                    className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="mr-1">📄</span> Copy
                  </button>
                </div>
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50 whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {thoughtLeadershipPost}
                </div>
              </div>

              <div className="border-t border-gray-200 mb-5"></div>

              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                LinkedIn Publishing Best Practices
              </h3>
              
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-700 mb-1">Optimal Posting Times</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-800">Tuesday 10-11am</span>
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-800">Wednesday 2-3pm</span>
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-800">Thursday 9-10am</span>
                  <span className="px-2 py-0.5 text-xs rounded border border-gray-300 text-gray-600">Tuesday-Thursday</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-700 mb-1">Engagement Tips</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>End with a question to prompt comments</li>
                  <li>Respond to all comments within 2 hours</li>
                  <li>Tag relevant connections (maximum 5)</li>
                  <li>Include a call-to-action</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button 
                type="button"
                onClick={handleClose} 
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {snackbarOpen && (
        <div 
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-60 px-4 py-3 rounded-md shadow-lg bg-green-100 border border-green-200 text-green-800 transition-all duration-300 ease-in-out"
          role="alert"
        >
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span className="text-sm font-medium">{snackbarMessage}</span>
            <button 
              type="button" 
              onClick={handleSnackbarClose} 
              className="ml-4 p-1 rounded-full text-green-600 hover:bg-green-200 focus:outline-none focus:ring-1 focus:ring-green-500"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
