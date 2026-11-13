import type { Menu } from '@/types/menu';
import { Calendar, CalendarSync, User2 } from 'lucide-react';

export const mobileMenu: Menu[] = [
  {
    id: 1,
    name: 'Daily Photos',
    link: '/',
    icon: Calendar,
  },
  {
    id: 2,
    name: 'Rewind',
    link: '/rewind',
    icon: CalendarSync,
  },
  {
    id: 3,
    name: 'Profile',
    link: '/profile',
    icon: User2,
  },
];

export const desktopMenu: Menu[] = [
  {
    id: 1,
    name: 'Daily Photos',
    link: '/',
    icon: Calendar,
  },
  {
    id: 2,
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
];
