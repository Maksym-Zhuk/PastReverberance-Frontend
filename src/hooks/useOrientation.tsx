'use client';
import { useEffect, useState } from 'react';

export function useOrientation() {
  const getOrientation = () => {
    if (typeof window !== 'undefined' && 'orientation' in screen) {
      return screen.orientation.type;
    }
    return 'unknown';
  };

  const [orientation, setOrientation] = useState(getOrientation);

  useEffect(() => {
    if (typeof window === 'undefined' || !('orientation' in screen)) return;

    const handleChange = () => {
      setOrientation(screen.orientation.type);
    };

    screen.orientation.addEventListener('change', handleChange);

    return () => {
      screen.orientation.removeEventListener('change', handleChange);
    };
  }, []);

  return orientation;
}
