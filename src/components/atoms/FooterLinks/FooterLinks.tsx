import React from 'react';
import { Link } from '@tanstack/react-router';

interface LinkItem {
  label: string;
  to?: string;
}

const linkGroups: LinkItem[][] = [
  [
    { label: 'How it works' },
    { label: 'Why Nutri Plan' },
    { label: 'FAQs' },
    { label: 'Become a chef' },
    { label: 'Careers' },
  ],
  [
    { label: 'Delivery Map' },
    { label: 'Gift Card' },
    { label: 'Sustainability' },
    { label: 'Special Lines' },
    { label: 'Clean Line' },
    { label: 'Blog' },
  ],
];

const FooterLinks: React.FC = () => (
  <>
    {linkGroups.map((group, index) => (
      <ul key={index} className='flex max-w-[296px] flex-col gap-[16px]'>
        {group.map(({ label, to }) => (
          <li
            key={label}
            className='cursor-pointer text-[14px] font-medium text-[#d1d1d6]'
          >
            {to ? (
              <Link to={to} className='hover:underline'>
                {label}
              </Link>
            ) : (
              <span className='text-gray-700'>{label}</span>
            )}
          </li>
        ))}
      </ul>
    ))}
  </>
);

export default FooterLinks;
