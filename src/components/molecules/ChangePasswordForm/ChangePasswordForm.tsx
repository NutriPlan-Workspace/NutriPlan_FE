import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { useToast } from '@/contexts/ToastContext';
import { useChangePasswordRequestMutation } from '@/redux/query/apis/auth/authApi';
import {
  changePasswordSchema,
  ChangePasswordSchemaType,
} from '@/schemas/passwordSchema';

interface ChangePasswordFormProps {
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose }) => {
  const [changePasswordRequest, { isLoading }] =
    useChangePasswordRequestMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { showToastError, showToastSuccess } = useToast();

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    try {
      const response = await changePasswordRequest(data).unwrap();
      if (response.code === HTTP_STATUS.OK) {
        showToastSuccess('Password changed successfully');
        reset();
      } else {
        showToastError(response.message);
      }
      onClose();
    } catch (error) {
      showToastError(`Something went wrong ${error}`);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='mt-5 flex flex-col gap-4'
    >
      <h1 className='py-2 text-2xl font-thin'>Change password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-5'>
            <label className='w-[200px] pt-1'>Current Password</label>
            <Controller
              name='currentPassword'
              control={control}
              render={({ field }) => (
                <InputField
                  type='password'
                  placeholder='Current Password'
                  showPasswordToggle={true}
                  error={errors.currentPassword?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className='flex gap-5'>
            <label className='w-[200px] pt-1'>New Password</label>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <InputField
                  type='password'
                  placeholder='New Password'
                  showPasswordToggle={true}
                  error={errors.newPassword?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className='flex gap-5'>
            <label className='w-[200px] pt-1'>Confirm New Password</label>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <InputField
                  type='password'
                  placeholder='Confirm New Password'
                  error={errors.confirmPassword?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className='mt-5 ml-[200px] flex items-center gap-2'>
          <Button
            className='hover:border-primary hover:text-primary transition-all'
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            htmlType='submit'
            disabled={isLoading}
            className='bg-primary hover:bg-primary-400 border-none px-[24px] text-black disabled:bg-gray-500 disabled:text-white disabled:opacity-50'
          >
            {isLoading ? 'Loading...' : 'Save'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChangePasswordForm;
