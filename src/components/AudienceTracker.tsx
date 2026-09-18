'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AudienceTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.localStorage.getItem('alwasil-cookie-consent') !== 'accepted') return;
    void fetch('/api/audience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer: document.referrer, consent: true }),
      keepalive: true,
    });
  }, [pathname]);
  return null;
}
