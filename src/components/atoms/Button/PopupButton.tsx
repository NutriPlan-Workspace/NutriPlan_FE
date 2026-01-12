import React from 'react';
import { Button } from 'antd';

import { cn } from '@/helpers/helpers';

interface PopupButtonProps {
  onClick: () => void;
  variant?: 'default' | 'userHub';
  mode?: 'card' | 'action';
  label?: string;
  className?: string;
}

const PopupButton: React.FC<PopupButtonProps> = ({
  onClick,
  variant = 'default',
  mode = 'card',
  label,
  className,
}) => {
  const isUserHub = variant === 'userHub';

  if (mode === 'action') {
    return (
      <Button
        onClick={onClick}
        className={cn(
          'h-11 rounded-2xl border-none px-5 text-sm font-semibold text-white',
          isUserHub
            ? 'bg-[#ef7a66] hover:bg-[#e86852]'
            : 'bg-primary hover:bg-primary-400',
          className,
        )}
      >
        {label ?? 'Update Nutrition Targets'}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'w-full rounded-2xl border p-4 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl',
        isUserHub
          ? 'border-rose-100 bg-white/70'
          : 'border-black/10 bg-white/70',
        className,
      )}
    >
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <div
            className={cn(
              'text-sm font-semibold',
              isUserHub ? 'text-[#e86852]' : 'text-gray-900',
            )}
          >
            Nutrition targets updated
          </div>
          <div className='mt-1 text-sm text-gray-600'>
            Your dietary requirements have changed. Review and save a new target
            when you’re ready.
          </div>
        </div>

        <Button
          onClick={onClick}
          className={cn(
            'h-11 w-full rounded-2xl border-none px-5 text-sm font-semibold text-white sm:w-auto',
            isUserHub
              ? 'bg-[#ef7a66] hover:bg-[#e86852]'
              : 'bg-primary hover:bg-primary-400',
          )}
        >
          Update Nutrition Targets
        </Button>
      </div>
    </div>
  );
};

export default PopupButton;
