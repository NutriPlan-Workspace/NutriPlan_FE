import React from 'react';

import { cn } from '@/helpers/helpers';

type HubPageShellProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClassName?: string;
  className?: string;
};

const HubPageShell: React.FC<HubPageShellProps> = ({
  title,
  description,
  actions,
  children,
  maxWidthClassName = 'max-w-6xl',
  className,
}) => (
  <div className={cn('w-full px-4 py-8 sm:px-6 lg:px-8', className)}>
    <div className={cn('mx-auto w-full', maxWidthClassName)}>
      {(title || description || actions) && (
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div className='min-w-0'>
            {title && (
              <div className='text-2xl font-semibold tracking-tight text-gray-900'>
                {title}
              </div>
            )}
            {description && (
              <div className='mt-1 max-w-2xl text-sm text-gray-600'>
                {description}
              </div>
            )}
          </div>
          {actions && (
            <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
              {actions}
            </div>
          )}
        </div>
      )}

      <div className='rounded-3xl border border-white/40 bg-white/75 p-5 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/85 sm:p-7'>
        {children}
      </div>
    </div>
  </div>
);

export default HubPageShell;
