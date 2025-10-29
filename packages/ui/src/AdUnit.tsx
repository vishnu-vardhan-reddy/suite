'use client';

import React, { useEffect } from 'react';

export interface AdUnitProps {
  size: 'leaderboard' | 'rectangle' | 'large-rectangle' | 'mobile-banner';
  className?: string;
  slot?: string; // AdSense ad slot ID
}

export const AdUnit = ({ size, className = "", slot }: AdUnitProps) => {
  const sizes = {
    'leaderboard': { width: 728, height: 90 },
    'rectangle': { width: 300, height: 250 },
    'large-rectangle': { width: 336, height: 280 },
    'mobile-banner': { width: 320, height: 50 }
  };

  const adSize = sizes[size];

  useEffect(() => {
    // Only push ads in production and if window.adsbygoogle exists
    if (process.env.NODE_ENV === 'production') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  // Show placeholder in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`${className} bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center`} style={{ width: adSize.width, height: adSize.height }}>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Advertisement</p>
          <p className="text-[10px] text-gray-600">{size} - {adSize.width}x{adSize.height}</p>
        </div>
      </div>
    );
  }

  // Show real AdSense ad in production
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7486131585188364"
        data-ad-slot={slot || "1234567890"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};