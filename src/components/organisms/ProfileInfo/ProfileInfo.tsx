import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Button } from '@/atoms/Button';
import { cn } from '@/helpers/helpers';
import { ChangePasswordForm } from '@/molecules/ChangePasswordForm';
import PopupUpload from '@/molecules/PopupUpload/PopupUpload';
import { useUpdateAvatarRequestMutation } from '@/redux/query/apis/auth/authApi';
import { userSelector } from '@/redux/slices/user';

const ProfileInfo: React.FC = () => {
  const user = useSelector(userSelector).user;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [updateAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateAvatarRequestMutation();

  const initials = (user?.fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className='flex flex-col gap-6'>
      <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Profile</h2>
          <p className='mt-1 text-sm text-gray-600'>
            Update your avatar and account identity.
          </p>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-4'>
            <div className='relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-rose-100'>
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt='Avatar'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-50 to-white text-sm font-bold tracking-[0.12em] text-[#e86852]'>
                  {initials || 'U'}
                </div>
              )}
            </div>

            <div>
              <div className='text-sm font-semibold text-gray-900'>
                {user?.fullName}
              </div>
              <div className='mt-1 text-sm text-gray-600'>{user?.email}</div>
            </div>
          </div>

          <Button
            className={cn(
              'h-11 rounded-2xl border-none bg-rose-50 px-4 font-semibold text-[#e86852] hover:!bg-rose-100',
            )}
            disabled={isUpdatingAvatar}
            onClick={() => setIsAvatarModalOpen(true)}
          >
            {isUpdatingAvatar ? 'Updating…' : 'Change avatar'}
          </Button>
        </div>

        <PopupUpload
          isModalOpen={isAvatarModalOpen}
          setModalOpen={setIsAvatarModalOpen}
          onUploaded={(url) => {
            updateAvatar({ avatarUrl: url });
          }}
        />
      </section>

      <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'>
        <div className='mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Credentials</h2>
          <p className='mt-1 text-sm text-gray-600'>
            Update your login details and password.
          </p>
        </div>

        <div className='space-y-4'>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='text-sm font-medium text-gray-700'>Email</div>
              <div className='mt-1 text-sm text-gray-600'>{user?.email}</div>
            </div>
          </div>

          <div className='h-px bg-black/5' />

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <div className='text-sm font-medium text-gray-700'>Password</div>
              <div className='mt-1 text-sm text-gray-600'>{'•'.repeat(12)}</div>
            </div>
            <Button
              className={cn(
                'h-11 rounded-2xl border-none bg-rose-50 px-4 font-semibold text-[#e86852] hover:!bg-rose-100',
                { '!bg-rose-100': showChangePassword },
              )}
              onClick={() => setShowChangePassword(true)}
            >
              Change password
            </Button>
          </div>
        </div>
      </section>

      {showChangePassword && (
        <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Change Password
            </h2>
            <p className='mt-1 text-sm text-gray-600'>
              Use a strong password you don’t reuse elsewhere.
            </p>
          </div>
          <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
        </section>
      )}
    </div>
  );
};

export default ProfileInfo;
