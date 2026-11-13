'use client';
import { mobileMenu } from '@/constants/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarMobile() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="bg-card/95 fixed inset-x-0 bottom-0 z-40 flex justify-around border-t px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      {mobileMenu.map((item) => {
        const active = pathname === item.link;
        return (
          <Link
            key={item.id}
            href={item.link}
            aria-label={item.name}
            aria-current={active ? 'page' : undefined}
            className={`flex min-w-16 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon size={22} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
