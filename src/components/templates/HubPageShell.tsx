import React from 'react';
import { useRouterState } from '@tanstack/react-router';
import { motion } from 'framer-motion';

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
}) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className={cn('w-full px-4 py-8 sm:px-6 lg:px-8', className)}>
      <div className={cn('mx-auto w-full', maxWidthClassName)}>
        {(title || description || actions) && (
          <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
            <div className='min-w-0'>
              {title && (
                <motion.div
                  key={`${pathname}-title`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className='text-2xl font-semibold tracking-tight text-gray-900'
                >
                  {title}
                </motion.div>
              )}
              {description && (
                <motion.div
                  key={`${pathname}-desc`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className='mt-1 max-w-2xl text-sm text-gray-600'
                >
                  {description}
                </motion.div>
              )}
            </div>
            {actions && (
              <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
                {actions}
              </div>
            )}
          </div>
        )}

        <div
          data-tour='hub-shell'
          className='rounded-3xl border border-white/40 bg-white/75 p-5 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)] saturate-150 backdrop-blur-2xl supports-[backdrop-filter:blur(0px)]:bg-white/85 sm:p-7'
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HubPageShell;
