import React from 'react';

const FooterBottom: React.FC = () => (
  <div className='mx-auto mt-10 flex flex-col items-center space-y-3 text-center text-slate-400'>
    <div className='flex flex-wrap justify-center gap-4'>
      <a
        href='#'
        className='text-[13px] font-medium hover:text-white hover:underline'
      >
        Terms & Conditions
      </a>
      <a
        href='#'
        className='text-[13px] font-medium hover:text-white hover:underline'
      >
        Privacy Policy
      </a>
      <a
        href='#'
        className='text-[13px] font-medium hover:text-white hover:underline'
      >
        support@nutriplan.com
      </a>
    </div>
    <p className='text-[12px] font-light tracking-wide'>
      © Copyright 2025 NutriPlan
    </p>
  </div>
);

export default FooterBottom;
