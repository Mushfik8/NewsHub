'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  type?: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const sizes = {
  banner: {
    label: 'Advertisement (728x90)',
    heightClass: 'min-h-[90px]',
  },
  rectangle: {
    label: 'Advertisement (336x280)',
    heightClass: 'min-h-[280px]',
  },
  sidebar: {
    label: 'Advertisement (300x250)',
    heightClass: 'min-h-[250px]',
  },
} as const;

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const slotIds = {
  banner:
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT ||
    '',
  rectangle:
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT ||
    '',
  sidebar:
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT ||
    '',
} as const;

export default function AdSlot({ type = 'rectangle', className = '' }: AdSlotProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { label, heightClass } = sizes[type];
  const slot = slotIds[type];
  const hasLiveAds = Boolean(adsenseClient && slot);
  const autoAdsOnly = Boolean(adsenseClient && !slot);

  useEffect(() => {
    if (!hasLiveAds || !wrapperRef.current) {
      return;
    }

    const adElement = wrapperRef.current.querySelector('ins');
    if (!adElement || adElement.getAttribute('data-adsbygoogle-status')) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('[AdSlot] Failed to render ad', error);
    }
  }, [hasLiveAds, slot, type]);

  if (autoAdsOnly) {
    return null;
  }

  if (!hasLiveAds) {
    return (
      <div className={`ad-slot ${heightClass} ${className}`} aria-label="Advertisement">
        <div className="text-center">
          <p className="text-slate-300 dark:text-slate-500 text-xs uppercase tracking-wider font-medium">বিজ্ঞাপন</p>
          <p className="text-slate-200 dark:text-slate-600 text-xs mt-1">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`w-full overflow-hidden flex items-center justify-center ${heightClass} ${className}`}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={type === 'banner' ? 'horizontal' : 'auto'}
        data-full-width-responsive={type === 'banner' ? 'false' : 'true'}
        data-adtest={process.env.NODE_ENV !== 'production' ? 'on' : undefined}
      />
    </div>
  );
}
