import React from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

interface MenuItem {
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: 'Browse Foods', path: PATH.BROWSE_FOODS },
  { label: 'How it works', path: PATH.HOW_IT_WORKS },
  { label: 'Why Nutriplan', path: PATH.WHY_NUTRIPLAN },
  { label: 'Supported Diets', path: PATH.SUPPORTED_DIETS },
  { label: 'For Professionals', path: PATH.FOR_PROFESSIONALS },
  { label: 'About us', path: PATH.ABOUT_US },
];

const Navigation: React.FC = () => (
  <nav className='ml-8 flex justify-center'>
    <ul className='flex gap-10'>
      {menuItems.map(({ label, path }, index) => (
        <li
          key={index}
          className={`text-[14px] font-thin text-[#4d4d4f] hover:underline ${
            path !== PATH.BROWSE_FOODS ? 'text-white' : ''
          }`}
        >
          <Link to={path}>{label}</Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Navigation;
