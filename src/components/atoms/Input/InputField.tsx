import { forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Input, InputProps as AntdInputProps, InputRef } from 'antd';

import { cn } from '@/helpers/helpers';

interface InputFieldProps extends AntdInputProps {
  error?: string;
  showPasswordToggle?: boolean;
}

const InputField = forwardRef<InputRef, InputFieldProps>(
  ({ type, error, showPasswordToggle = true, ...props }, ref) => {
    const inputProps =
      type === 'password' && !showPasswordToggle
        ? { iconRender: () => null }
        : {};

    return (
      <div>
        <Input
          ref={ref}
          type={type}
          {...inputProps}
          className={cn(
            'min-h-[44px] rounded-full border text-[14px] leading-[20px] focus:border-2',
            error ? 'border-error' : 'border-gray-300',
            'shadow-none outline-none focus:shadow-none',
          )}
          {...props}
        />

        {error && (
          <p className='flex-start text-error mt-1 flex items-start gap-1 text-[15px]'>
            <ExclamationCircleIcon className='h-6 w-6 overflow-visible' />
            <span className='overflow-visible whitespace-nowrap'>{error}</span>
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

export default InputField;
