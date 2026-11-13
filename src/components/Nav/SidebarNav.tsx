'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Menu } from '@/types/menu';

// shared look for every sidebar row: icon stays fixed at the left, label fades in
export const navItemClass = (active = false) =>
  `flex h-10 w-full items-center gap-3 overflow-hidden rounded-lg px-2.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-primary text-primary-foreground'
      : 'text-foreground hover:bg-accent'
  }`;

export function NavLabel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`whitespace-nowrap transition-opacity duration-200 ${
        open ? 'opacity-100 delay-100' : 'opacity-0'
      }`}
    >
      {children}
    </span>
  );
}

interface Props {
  menu: Menu[];
  sidebarOpen: boolean;
}

export default function SidebarNav({ menu, sidebarOpen }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col gap-1">
      {menu.map((item: Menu) => {
        const active = pathname === item.link;
        return (
          <Link
            href={item.link}
            key={item.id}
            aria-label={item.name}
            aria-current={active ? 'page' : undefined}
            className={navItemClass(active)}
          >
            <item.icon size={20} className="shrink-0" />
            <NavLabel open={sidebarOpen}>{item.name}</NavLabel>
          </Link>
        );
      })}
    </div>
  );
}
