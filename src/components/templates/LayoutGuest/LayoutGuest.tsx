import React from 'react';

import { Footer } from '@/molecules/Footer';
import { Header } from '@/molecules/Header';

const LayoutGuest: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className='flex min-h-screen flex-col'>
    <Header />

    <main className='flex-grow bg-[#f8f8f8]'>{children}</main>

    <footer className='bg-slate-950 px-6 py-10 text-white lg:px-10 xl:px-24'>
      <Footer />
    </footer>
  </div>
);

export default LayoutGuest;
