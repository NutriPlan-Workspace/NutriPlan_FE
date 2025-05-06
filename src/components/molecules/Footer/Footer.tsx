import React from 'react';
import { Link } from '@tanstack/react-router';

import { FooterBottom } from '@/atoms/FooterBottom';
import { FooterLinks } from '@/atoms/FooterLinks';
import { SocialLinks } from '@/atoms/SocialLinks';
import { PATH } from '@/constants/path';

const Footer: React.FC = () => (
  <div className='py-8'>
    <div className='mx-auto w-full max-w-[1200px]'>
      <div className='flex justify-between gap-8'>
        {/* Logo */}
        <div className='w-full max-w-[296px] flex-1/4'>
          <Link
            to={PATH.HOME}
            className='mx-auto text-start text-lg font-bold text-white'
          >
            <img
              src='src/assets/noBgWhite.png'
              alt='Logo'
              className='w-36 object-cover'
            />
          </Link>
        </div>

        <div className='flex w-full flex-1/2 justify-around gap-8'>
          <FooterLinks />
        </div>

        <SocialLinks />
      </div>

      <FooterBottom />
    </div>
  </div>
);

export default Footer;
