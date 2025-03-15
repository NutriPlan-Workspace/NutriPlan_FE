import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema } from '@/schemas/loginSchema';

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginFormContent: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    // Ensures the input fields are initialized to an empty string avoid undefined value
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, isLoading } = useLogin();

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data);
  };

  return (
    <>
      <Button
        type='text'
        className='font-display mb-4 -ml-2 flex items-center gap-0 self-start rounded-full p-0 py-1 pr-3 text-[rgb(77,77,79)] hover:bg-gray-100 disabled:cursor-not-allowed'
      >
        <ChevronLeftIcon className='color-black font-tt-norms ml-1 h-3.5 w-3.5 font-bold' />
        <div className='font-display p-0 text-[16px] font-thin'>Back</div>
      </Button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-4'
      >
        <p className='font-display text-left text-[16px] font-bold'>
          Log in with email
        </p>
        {/* Register not work with antd design inputs: [https://github.com/react-hook-form/react-hook-form/issues/245] */}
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <InputField
              type='email'
              placeholder='Email'
              error={errors.email?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <InputField
              type='password'
              placeholder='Password'
              showPasswordToggle={false}
              error={errors.password?.message}
              {...field}
            />
          )}
        />

        <Button
          htmlType='submit'
          disabled={isLoading}
          className='bg-primary hover:bg-primary-400 h-[42px] w-full border-none px-[24px] py-[9px] text-[16px] font-bold text-black disabled:bg-gray-500 disabled:text-white disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Log In'}
        </Button>
      </form>
      <div className='font-display mt-3 cursor-pointer text-[16px] font-bold underline hover:text-gray-900 hover:opacity-80'>
        Forgot password?
      </div>
    </>
  );
};

export default LoginFormContent;
