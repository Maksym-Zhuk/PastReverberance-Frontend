'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { Menu } from '@/types/menu';

interface Props {
  menu: Menu[];
  sidebarOpen: boolean;
}

export default function SidebarNav({ menu, sidebarOpen }: Props) {
  const pathname = usePathname();

  return (
    <div className="mt-6 w-full space-y-1 px-1">
      {menu.map((item: Menu) => {
        const active = pathname === item.link;
        return (
          <Link
            href={item.link}
            key={item.id}
            aria-label={item.name}
            aria-current={active ? 'page' : undefined}
            className={`flex h-14 w-full cursor-pointer items-center justify-center rounded-xl p-4 transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent'
            }`}
          >
            <item.icon size={28} className="shrink-0" />
            <m.span
              initial={false}
              animate={{
                opacity: sidebarOpen ? 1 : 0,
                width: sidebarOpen ? '100%' : '0%',
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative left-1 flex items-center overflow-hidden whitespace-nowrap"
            >
              {item.name}
            </m.span>
          </Link>
        );
      })}
    </div>
  );
}
