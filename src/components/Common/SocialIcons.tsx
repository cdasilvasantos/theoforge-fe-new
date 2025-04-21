import React from 'react';
// Using react-icons for consistency - Correcting import path
import { FaLinkedinIn, FaYoutube, FaGithub, FaDiscord, FaTwitter as FaXTwitter } from 'react-icons/fa6'; // Using FaTwitter for the Twitter logo

// Define the structure for a social link
interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType; // Use ElementType for component types
  ariaLabel: string;
}

// --- Social Links Data ---
const socialLinksData: SocialLink[] = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/keithwilliams5/', // Updated LinkedIn link
    icon: FaLinkedinIn,
    ariaLabel: 'Follow Keith Williams on LinkedIn',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@theoforge', // Updated YouTube channel link
    icon: FaYoutube,
    ariaLabel: 'Subscribe to TheoForge on YouTube',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/theoforge', // Use org URL
    icon: FaGithub,
    ariaLabel: 'Explore Theoforge on GitHub',
  },
  {
    name: 'Twitter', // Or X
    href: 'https://twitter.com/theoforgeai', // Placeholder URL
    icon: FaXTwitter, // Corrected icon
    ariaLabel: 'Follow Theoforge on Twitter/X',
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/fp4NrUjCa5', // Updated Discord invite link
    icon: FaDiscord,
    ariaLabel: 'Join the Theoforge Discord Community',
  },
];

// --- Social Icons Component ---
interface SocialIconsProps extends React.HTMLAttributes<HTMLDivElement> {
  // No specific props needed beyond standard div attributes like className
}

/**
 * Renders a row of social media icons with links.
 * Uses react-icons for scalable vector icons.
 */
const SocialIcons: React.FC<SocialIconsProps> = ({ className }) => {
  return (
    // Reduce space-x for slightly tighter mobile, className allows overrides
    <div className={`flex space-x-4 ${className || ''}`}>
      {socialLinksData.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.ariaLabel}
          // Add padding to increase tap target size, maintain transition
          className="p-1.5 block text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
        >
          <span className="sr-only">{link.ariaLabel}</span> {/* Added for screen readers */}
          <link.icon className="w-5 h-5" aria-hidden="true" /> {/* Hiding decorative icon */}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;
