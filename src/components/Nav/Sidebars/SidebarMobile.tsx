'use client';
import Dialog from '@/components/dailyPhotos/Dialog';
import Drawer from '@/components/dailyPhotos/Drawer';
import { mobileMenu } from '@/constants/menu';
import { useOrientation } from '@/hooks/useOrientation';
import { Menu } from '@/types/menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarMobile() {
  const pathname = usePathname();
  const orientation = useOrientation();

  return (
    <div
      className={`lg:hidden fixed top-[90dvh] w-full ${orientation == 'landscape-primary' ? 'hidden' : 'flex h-[10dvh]'} justify-center items-center p-3 gap-3 z-10 pb-10`}
    >
      <div
        className={`${pathname == '/dailyPhotos' ? 'max-[400px]:w-[230px] w-75' : 'w-75'} duration-300 h-17.5 rounded-4xl flex justify-around items-center bg-white shadow-lg`}
      >
        {mobileMenu.map((item: Menu) => (
          <Link
            href={item.link}
            key={item.id}
            className={`${pathname == item.link ? ' bg-black text-white' : 'text-black'} cursor-pointer w-15 h-15 rounded-[30px] flex justify-center items-center`}
          >
            <item.icon size={28} />
          </Link>
        ))}
      </div>
      <div className={pathname == '/' ? 'flex' : 'hidden'}>
        <div className="min-[550px]:hidden ">
          <Drawer />
        </div>
        <div className="lg:hidden max-[550px]:hidden">
          <Dialog />
        </div>
      </div>
    </div>
  );
}
