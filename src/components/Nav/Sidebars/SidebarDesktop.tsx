'use client';
import { desktopDownMenu, desktopMenu } from '@/constants/menu';
import { domAnimation, LazyMotion, m } from 'framer-motion';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useState } from 'react';
import SidebarNav from '../SidebarNav';

export default function SidebarDesktop() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handlerOpenSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="lg:flex hidden items-center sticky top-0 min-w-27.5 min-h-[100dvh] p-5 duration-300">
        <m.div
          animate={{ width: sidebarOpen ? '170px' : '70px' }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 50,
          }}
          className={`w-full h-full bg-white border rounded-2xl shadow-lg flex flex-col justify-between ${sidebarOpen ? 'items-start' : 'items-center'} pb-1`}
        >
          <div className="w-full flex justify-end p-5">
            {sidebarOpen ? (
              <PanelRightOpen
                className="text-black cursor-pointer"
                onClick={() => handlerOpenSidebar()}
              />
            ) : (
              <PanelRightClose
                className="text-black cursor-pointer"
                onClick={() => handlerOpenSidebar()}
              />
            )}
          </div>
          <SidebarNav menu={desktopMenu} sidebarOpen={sidebarOpen} />
          <SidebarNav menu={desktopDownMenu} sidebarOpen={sidebarOpen} />
        </m.div>
      </div>
    </LazyMotion>
  );
}
