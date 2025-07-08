'use client';
import { useEffect, useState } from 'react';

export function useOrientation() {
  const [orientation, setOrientation] = useState<
    'portrait-primary' | 'landscape-primary' | 'unknown'
  >('unknown');

  useEffect(() => {
    if (typeof window === 'undefined' || !('orientation' in screen)) return;

    const updateOrientation = () => {
      setOrientation(screen.orientation.type as typeof orientation);
    };

    updateOrientation();
    screen.orientation.addEventListener('change', updateOrientation);

    return () => {
      screen.orientation.removeEventListener('change', updateOrientation);
    };
  }, []);

  return orientation;
}
