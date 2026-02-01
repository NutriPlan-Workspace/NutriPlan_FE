import React from 'react';
import { Link } from '@tanstack/react-router';

import { PUBLIC_NAV_ITEMS } from '@/constants/navigation';

const Navigation: React.FC = () => (
  <nav className='ml-8 flex justify-center'>
    <ul className='flex items-center gap-8'>
      {PUBLIC_NAV_ITEMS.map(({ label, path }, index) => (
        <li key={index} className='text-sm font-semibold text-gray-600'>
          <Link className='transition hover:text-emerald-600' to={path}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Navigation;
