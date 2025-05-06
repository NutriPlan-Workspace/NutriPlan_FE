import React from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

interface MenuItem {
  label: string;
  path?: string;
}

const menuItems: MenuItem[] = [
  { label: 'Browse Foods', path: PATH.BROWSE_FOODS },
  { label: 'How it works' },
  { label: 'Why Nutriplan' },
  { label: 'Supported Diets' },
  { label: 'For Professionals' },
  { label: 'About us' },
];

const Navigation: React.FC = () => (
  <nav className='ml-8 flex justify-center'>
    <ul className='flex gap-10'>
      {menuItems.map(({ label, path }, index) => (
        <li
          key={index}
          className='cursor-pointer text-[14px] font-thin text-[#4d4d4f]'
        >
          {path ? (
            <Link className='hover:underline' to={path}>
              {label}
            </Link>
          ) : (
            <span className='text-gray-300'>{label}</span>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

export default Navigation;
