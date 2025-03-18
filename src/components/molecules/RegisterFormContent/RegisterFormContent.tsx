import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaChevronLeft } from 'react-icons/fa6';
import { HiMiniArrowTopRightOnSquare } from 'react-icons/hi2';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Checkbox } from 'antd';
import z from 'zod';

import { Button } from '@/atoms/Button';
import { ErrorMessage } from '@/atoms/ErrorMessage';
import { InputField } from '@/atoms/Input';
import { PATH } from '@/constants/path';
import { cn } from '@/helpers/helpers';
import { useRegister } from '@/hooks/useAuth';
import { registerSchema } from '@/schemas/registerSchema';

type RegisterFormInputs = z.infer<typeof registerSchema>;

const formFields: {
  name: keyof RegisterFormInputs;
  type: string;
  placeholder: string;
  showPasswordToggle?: boolean;
}[] = [
  { name: 'fullName', type: 'text', placeholder: 'Full Name' },
  { name: 'email', type: 'email', placeholder: 'Email' },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    showPasswordToggle: false,
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm Password',
    showPasswordToggle: false,
  },
];
const defaultValues = formFields.reduce(
  (acc, field) => ({ ...acc, [field.name]: '' }),
  { termsAccepted: false },
);

const RegisterFormContent: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const { register, isLoading } = useRegister();

  const onSubmit = async (data: RegisterFormInputs) => {
    await register(data);
  };

  return (
    <>
      <Button
        type='text'
        className='font-display mb-1 -ml-2 flex items-center gap-0 self-start rounded-full p-0 py-1 pr-3 text-[rgb(77,77,79)] hover:bg-gray-100 disabled:cursor-not-allowed'
      >
        <FaChevronLeft className='color-black font-tt-norms ml-1 h-3.5 w-3.5 font-bold' />
        <div className='font-display p-0 text-[16px] font-thin'>Back</div>
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col'>
        <p className='mb-3 text-left font-bold'>Register with your email</p>

        {formFields.map(
          ({ name, type, placeholder, showPasswordToggle = true }) => (
            <div
              key={name}
              className={cn({ 'mb-1': errors[name], 'mb-3': !errors[name] })}
            >
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <InputField
                    type={type}
                    placeholder={placeholder}
                    error={errors[name]?.message}
                    showPasswordToggle={showPasswordToggle}
                    {...field}
                    value={typeof field.value === 'boolean' ? '' : field.value}
                  />
                )}
              />
            </div>
          ),
        )}

        <div className={cn(errors.termsAccepted ? 'mb-1' : 'mb-3')}>
          <div className='flex items-center gap-2'>
            <Controller
              name='termsAccepted'
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <div className='flex items-center text-sm text-gray-700'>
              I agree with the&nbsp;
              <Link
                to={PATH.TERMS_OF_SERVICE}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary flex items-center font-medium'
              >
                Terms of Service
                <HiMiniArrowTopRightOnSquare className='ml-1 h-5 w-5 font-bold' />
              </Link>
            </div>
            ;
          </div>
          {errors?.termsAccepted?.message && (
            <ErrorMessage message={errors.termsAccepted.message} />
          )}
        </div>

        <Button
          htmlType='submit'
          disabled={isLoading}
          className='bg-primary hover:bg-primary-400 h-[42px] w-full border-none px-[24px] py-[9px] text-[16px] font-bold text-black disabled:bg-gray-500 disabled:text-white disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Create Account'}
        </Button>
      </form>
    </>
  );
};

export default RegisterFormContent;
