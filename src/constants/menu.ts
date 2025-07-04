import type { Menu } from '@/types/menu';
import { Calendar, CalendarSync, House, Settings, User2 } from 'lucide-react';

export const mobileMenu: Menu[] = [
  {
    id: 1,
    name: 'Home',
    link: '/',
    icon: House,
  },
  {
    id: 2,
    name: 'Daily Photos',
    link: '/dailyPhotos',
    icon: Calendar,
  },
  {
    id: 3,
    name: 'Rewind',
    link: '/rewind',
    icon: CalendarSync,
  },
];

export const desktopMenu: Menu[] = [
  {
    id: 1,
    name: 'Home',
    link: '/',
    icon: House,
  },
  {
    id: 2,
    name: 'Daily Photos',
    link: '/dailyPhotos',
    icon: Calendar,
  },
  {
    id: 3,
    name: 'Rewind',
    link: '/rewind',
    icon: CalendarSync,
  },
];

export const desktopDownMenu: Menu[] = [
  {
    id: 1,
    name: 'Profile',
    link: '/profile',
    icon: User2,
  },
  {
    id: 2,
    name: 'Settings',
    link: '/settings',
    icon: Settings,
  },
];
