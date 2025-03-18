import React from 'react';
import { Link } from '@tanstack/react-router';

import { PATH } from '@/constants/path';

interface LinkItem {
  label: string;
  to: string;
}

const linkGroups: LinkItem[][] = [
  [
    { label: 'How it works', to: PATH.HOW_IT_WORKS },
    { label: 'Why Nutri Plan', to: PATH.WHY_NUTRIPLAN },
    { label: 'FAQs', to: PATH.FAQS },
    { label: 'Become a chef', to: PATH.BECOME_CHEF },
    { label: 'Careers', to: PATH.CAREERS },
  ],
  [
    { label: 'Delivery Map', to: PATH.DELIVERY_MAP },
    { label: 'Gift Card', to: PATH.GIFT_CARD },
    { label: 'Sustainability', to: PATH.SUSTAINABILITY },
    { label: 'Special Lines', to: PATH.SPECIAL_LINES },
    { label: 'Clean Line', to: PATH.CLEAN_LINE },
    { label: 'Blog', to: PATH.BLOG },
  ],
];

const FooterLinks: React.FC = () => (
  <>
    {linkGroups.map((group, index) => (
      <ul key={index} className='flex max-w-[296px] flex-col gap-[16px]'>
        {group.map(({ label, to }) => (
          <li key={label} className='text-[14px] font-medium text-[#d1d1d6]'>
            <Link to={to} className='hover:underline'>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    ))}
  </>
);

export default FooterLinks;
