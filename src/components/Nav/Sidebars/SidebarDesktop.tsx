'use client';
import { desktopDownMenu, desktopMenu } from '@/constants/menu';
import { domAnimation, LazyMotion, m } from 'framer-motion';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import SidebarNav from '../SidebarNav';

export default function SidebarDesktop() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const Toggle = sidebarOpen ? PanelRightOpen : PanelRightClose;

  return (
    <LazyMotion features={domAnimation}>
      <aside className="sticky top-0 hidden h-[100dvh] shrink-0 p-5 lg:flex">
        <m.nav
          aria-label="Main"
          animate={{ width: sidebarOpen ? 170 : 70 }}
          transition={{ type: 'spring', stiffness: 300, damping: 50 }}
          className="bg-card flex h-full flex-col items-stretch justify-between overflow-hidden rounded-2xl border pb-1 shadow-lg"
        >
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={sidebarOpen}
              className="text-foreground hover:bg-accent mt-4 mr-3 ml-auto flex size-10 items-center justify-center rounded-lg"
            >
              <Toggle />
            </button>
            <SidebarNav menu={desktopMenu} sidebarOpen={sidebarOpen} />
          </div>
          <div className="flex flex-col items-center">
            <ThemeToggle className="mb-2" />
            <SidebarNav menu={desktopDownMenu} sidebarOpen={sidebarOpen} />
          </div>
        </m.nav>
      </aside>
    </LazyMotion>
  );
}
