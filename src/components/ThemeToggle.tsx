'use client';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Theme, useTheme } from '@/hooks/useTheme';

// quick light <-> dark switch for headers/sidebars
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const toggle = () =>
    setTheme(
      document.documentElement.classList.contains('dark') ? 'light' : 'dark',
    );
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

// full 3-way chooser for the settings page
export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className="flex gap-2">
      {options.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          variant={theme === value ? 'default' : 'outline'}
          onClick={() => setTheme(value)}
          className="flex-1"
        >
          <Icon /> {label}
        </Button>
      ))}
    </div>
  );
}
