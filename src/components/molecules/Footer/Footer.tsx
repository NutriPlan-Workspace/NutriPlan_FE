import React from 'react';
import { Link } from '@tanstack/react-router';

import { FooterBottom } from '@/atoms/FooterBottom';
import { FooterLinks } from '@/atoms/FooterLinks';
import { SocialLinks } from '@/atoms/SocialLinks';
import { PATH } from '@/constants/path';

const Footer: React.FC = () => (
  <div className='relative overflow-hidden'>
    <div className='pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[120px]' />
    <div className='pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-sky-400/10 blur-[120px]' />

    <div className='relative mx-auto w-full max-w-7xl'>
      <div className='grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.1fr_1.6fr_0.7fr]'>
        <div className='flex flex-col gap-4'>
          <Link
            to={PATH.HOME}
            className='text-start text-lg font-bold text-white'
          >
            <img
              src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/tm52qbgqp7zljjgizukj.png'
              alt='Logo'
              className='w-36 object-cover'
            />
          </Link>
          <p className='max-w-xs text-sm text-slate-300'>
            Personalized meal plans, smarter shopping, and nutrition insights —
            all in one place.
          </p>
          <div className='flex items-center gap-3 text-xs text-slate-400'>
            <span className='rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1'>
              Vietnam-focused
            </span>
            <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>
              Updated weekly
            </span>
          </div>
        </div>

        <div className='flex flex-wrap gap-10'>
          <FooterLinks />
        </div>

        <SocialLinks />
      </div>

      <FooterBottom />
    </div>
  </div>
);

export default Footer;
