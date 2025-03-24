import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { z } from 'zod';

import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { PATH } from '@/constants/path';
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
      <div className='mt-3 cursor-pointer'>
        <Link
          className='font-display text-[16px] font-bold text-black underline hover:text-gray-900 hover:opacity-80'
          to={PATH.REGISTER}
        >
          Create new account ?
        </Link>
      </div>
    </>
  );
};

export default LoginFormContent;
