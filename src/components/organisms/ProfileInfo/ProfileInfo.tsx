import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { ChangePasswordForm } from '@/molecules/ChangePasswordForm';
import { userSelector } from '@/redux/slices/user';

const ProfileInfo: React.FC = () => {
  const user = useSelector(userSelector).user;
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className='m-10'>
      <div className='flex flex-col gap-2'>
        <h1 className='py-2 text-2xl font-thin'>Credentials</h1>
        <div className='flex items-center gap-2'>
          <p className='w-[200px]'>Email Address</p>
          <p className='text-sm font-thin text-gray-500'>{user?.email}</p>
        </div>
        <div className='flex items-center gap-2'>
          <p className='w-[200px]'>Password</p>
          <p className='mr-4'>{'•'.repeat(12)}</p>
          <Button
            className={cn(
              'hover:bg-primary-100 transform rounded-xl border-none transition-all duration-300 ease-in-out hover:scale-105 hover:text-black',
              { 'bg-primary-100': showChangePassword },
            )}
            onClick={() => setShowChangePassword(true)}
          >
            Change
          </Button>
        </div>
        {showChangePassword && (
          <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
