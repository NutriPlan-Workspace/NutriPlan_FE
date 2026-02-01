import { PATH } from '@/constants/path';

export type NavItem = {
  label: string;
  path: string;
};

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Browse Foods', path: PATH.BROWSE_FOODS },
  { label: 'How it works', path: PATH.HOW_IT_WORKS },
  { label: 'Articles', path: PATH.ARTICLES },
  { label: 'About us', path: PATH.ABOUT_US },
];
