import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const KEY = 'theme';
const listeners = new Set<() => void>();

const read = (): Theme => {
  const v = localStorage.getItem(KEY);
  return v === 'light' || v === 'dark' ? v : 'system';
};

export const applyTheme = (theme: Theme) => {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
};

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => 'system' as Theme,
  );
  const setTheme = (next: Theme) => {
    localStorage.setItem(KEY, next);
    applyTheme(next);
    listeners.forEach((l) => l());
  };
  return { theme, setTheme };
}
