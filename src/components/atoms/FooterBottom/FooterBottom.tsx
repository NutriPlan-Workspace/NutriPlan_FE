import React from 'react';

const FooterBottom: React.FC = () => (
  <div className='mx-auto mt-10 flex flex-col items-center space-y-3 text-center'>
    <div className='flex gap-4'>
      <a
        href='#'
        className='text-[14px] font-medium text-[#d1d1d6] hover:underline'
      >
        Terms & Conditions
      </a>
      <a
        href='#'
        className='text-[14px] font-medium text-[#d1d1d6] hover:underline'
      >
        Privacy Policy
      </a>
    </div>
    <a
      href='#'
      className='font-third font-weight-light text-[14px] text-[#d1d1d6] not-italic hover:underline'
    >
      support@nutriplan.com
    </a>
    <p className='font-secondary text-[14px] leading-[150%] font-extralight tracking-[-0.14px] text-[#d1d1d6] not-italic'>
      © Copyright 2025 NutriPlan
    </p>
  </div>
);

export default FooterBottom;
