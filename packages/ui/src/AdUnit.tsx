'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface AdUnitProps {
  size: 'leaderboard' | 'rectangle' | 'large-rectangle' | 'mobile-banner';
  className?: string;
  slot?: string;
}

export const AdUnit = ({ size, className = "", slot }: AdUnitProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const sizes = {
    'leaderboard': { width: '728px', height: '90px', minWidth: '728px' },
    'rectangle': { width: '300px', height: '250px', minWidth: '300px' },
    'large-rectangle': { width: '336px', height: '280px', minWidth: '336px' },
    'mobile-banner': { width: '320px', height: '50px', minWidth: '320px' }
  };

  const adSize = sizes[size];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || process.env.NODE_ENV !== 'production') {
      return;
    }

    // Wait for ad container to have proper dimensions
    const initAd = () => {
      if (!adRef.current) return;

      const rect = adRef.current.getBoundingClientRect();
      
      // Only initialize ad if container has width
      if (rect.width > 0) {
        try {
          // @ts-ignore
          if (window.adsbygoogle && window.adsbygoogle.loaded) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        } catch (e) {
          console.error('AdSense error:', e);
        }
      }
    };

    // Delay ad initialization to ensure DOM is ready
    const timer = setTimeout(initAd, 100);

    return () => clearTimeout(timer);
  }, [isClient]);

  // Show placeholder in development
  if (!isClient || process.env.NODE_ENV !== 'production') {
    return (
      <div 
        className={`${className} bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center`}
        style={{ 
          width: adSize.width, 
          height: adSize.height,
          minWidth: adSize.minWidth,
          maxWidth: adSize.width
        }}
      >
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Advertisement</p>
          <p className="text-[10px] text-gray-600">{size}</p>
        </div>
      </div>
    );
  }

  // Show real AdSense ad in production
  return (
    <div 
      ref={adRef}
      className={className}
      style={{ 
        width: adSize.width, 
        height: adSize.height,
        minWidth: adSize.minWidth,
        maxWidth: adSize.width,
        overflow: 'hidden'
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: adSize.width,
          height: adSize.height
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot || ""}
        data-ad-format="fixed"
        data-full-width-responsive="false"
      />
    </div>
  );
};