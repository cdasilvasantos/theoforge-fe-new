
import { useState, useEffect } from 'react';

// Tailwind's default sm breakpoint is 640px
const SM_BREAKPOINT = 640;

/**
 * Custom hook to track if the screen size is below the mobile breakpoint (sm).
 * Handles SSR hydration mismatches by initially returning false on the server
 * and then updating on the client after mount.
 *
 * @returns {boolean} True if the screen width is less than SM_BREAKPOINT, false otherwise.
 */
export function useMediaQuery(): boolean {
  // Initialize with a default value (false) to avoid SSR mismatch
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Function to check the media query
    const checkMediaQuery = () => {
      setIsMobile(window.innerWidth < SM_BREAKPOINT);
    };

    // Initial check after component mounts on the client
    checkMediaQuery();

    // Add resize listener
    window.addEventListener('resize', checkMediaQuery);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', checkMediaQuery);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return isMobile;
}

export default useMediaQuery;
