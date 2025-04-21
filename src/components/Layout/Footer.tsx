'use client';
import React from 'react';
import Link from 'next/link';
import SocialIcons from '../Common/SocialIcons';
import Image from 'next/image';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-12 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-sans"> {/* Use standard padding, theme colors */}
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between gap-y-10 gap-x-8 md:gap-x-16">

          <div className="w-full sm:w-2/5 md:w-1/3 lg:w-2/5">
            <h3 className="font-heading font-semibold text-xl mb-3 text-gray-900 dark:text-white flex items-center"> 
              <div className="mr-2">
                <Image
                  className="dark:invert"
                  src="/logo.png"
                  alt="TheoForge Logo"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <span>TheoForge</span>
            </h3>
            <p className="text-sm mb-6 leading-relaxed"> {/* Improved line height */}
              Guiding organizations through the complexities of AI adoption with strategic insight and technical expertise.
            </p>
          </div>

          <div className="w-1/2 sm:w-auto md:w-auto lg:w-auto">
            <h3 className="font-heading font-semibold text-base mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2"> 
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              {[ 
                { href: '/#about', label: 'About Us' },
                { href: '/#services', label: 'Services' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link 
                  key={link.label}
                  href={link.href} 
                  className={`text-sm hover:text-teal-700 dark:hover:text-teal-400 transition-colors duration-150 flex items-center`} // Use theme color
                >
                  <span className="w-1 h-1 bg-secondary rounded-full mr-2 opacity-75"></span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="w-1/2 sm:w-auto md:w-auto lg:w-auto">
            <h3 className="font-heading font-semibold text-base mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2"> 
              Connect
            </h3>
            <div className="flex space-x-3"> 
              <SocialIcons />
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 text-center"> {/* Use theme border color */}
          <p className="text-xs"> {/* Use theme color */}
            &copy; {currentYear} TheoForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
