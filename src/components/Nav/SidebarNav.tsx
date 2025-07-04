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
    <div className={`mt-10 w-full px-1`}>
      {menu.map((item: Menu) => (
        <Link
          href={item.link}
          key={item.id}
          className={`${pathname == item.link ? ' bg-black text-white' : 'text-black'} cursor-pointer w-full h-14 rounded-lg flex justify-center items-center p-4`}
        >
          <item.icon size={28} className="flex-shrink-0" />
          <m.div
            initial={{ opacity: 0, width: '0' }}
            animate={{
              opacity: sidebarOpen ? 1 : 0,
              width: sidebarOpen ? '100%' : '0%',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
              opacity: { duration: 0.3 },
              width: { duration: 0.3 },
            }}
            className={`flex items-center relative left-1 ${pathname === item.link ? 'text-white' : 'text-black'} overflow-hidden whitespace-nowrap`}
          >
            {item.name}
          </m.div>
        </Link>
      ))}
    </div>
  );
}
