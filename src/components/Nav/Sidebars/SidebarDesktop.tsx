'use client';
import { desktopDownMenu, desktopMenu } from '@/constants/menu';
import { useTheme } from '@/hooks/useTheme';
import { Moon, PanelRightClose, PanelRightOpen, Sun } from 'lucide-react';
import { useState } from 'react';
import SidebarNav, { NavLabel, navItemClass } from '../SidebarNav';

// 58 = 40px item + 2*8px padding + 2px border, so icons sit centered when collapsed
const COLLAPSED = 58;
const EXPANDED = 200;

export default function SidebarDesktop() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setTheme } = useTheme();
  const Toggle = sidebarOpen ? PanelRightOpen : PanelRightClose;

  return (
    <aside className="sticky top-0 hidden h-[100dvh] shrink-0 p-3 lg:flex">
      <nav
        aria-label="Main"
        style={{ width: sidebarOpen ? EXPANDED : COLLAPSED }}
        className="bg-card flex h-full flex-col justify-between overflow-hidden rounded-xl border p-2 shadow-lg transition-[width] duration-300 ease-out"
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
            className={navItemClass()}
          >
            <Toggle size={20} className="shrink-0" />
            <NavLabel open={sidebarOpen}>Collapse</NavLabel>
          </button>
          <SidebarNav menu={desktopMenu} sidebarOpen={sidebarOpen} />
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() =>
              setTheme(
                document.documentElement.classList.contains('dark')
                  ? 'light'
                  : 'dark',
              )
            }
            aria-label="Toggle theme"
            className={navItemClass()}
          >
            <Sun size={20} className="hidden shrink-0 dark:block" />
            <Moon size={20} className="shrink-0 dark:hidden" />
            <NavLabel open={sidebarOpen}>Theme</NavLabel>
          </button>
          <SidebarNav menu={desktopDownMenu} sidebarOpen={sidebarOpen} />
        </div>
      </nav>
    </aside>
  );
}
