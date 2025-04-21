'use client';

import React, { useEffect, useRef } from 'react';
import { toSvg } from 'jdenticon';

interface JdenticonIconProps {
  value: string; // String used to generate the icon
  size: number; // Size of the icon in pixels
}

const JdenticonIcon: React.FC<JdenticonIconProps> = ({ value, size }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      // Generate the SVG string
      const svgString = toSvg(value, size);
      // Set the innerHTML of the div to the SVG string
      iconRef.current.innerHTML = svgString;
    }
  }, [value, size]); // Re-render if value or size changes

  // Render a div container for the SVG
  // Jdenticon's toSvg generates a full <svg> element string
  return <div ref={iconRef} style={{ width: size, height: size, display: 'inline-block' }} />;
};

export default JdenticonIcon;
