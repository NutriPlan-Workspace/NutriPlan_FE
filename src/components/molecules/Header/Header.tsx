import React, { useCallback } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/atoms/Button';
import { NavigationHeader } from '@/atoms/NavigationHeader';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { PATH } from '@/constants/path';
import {
  authApi,
  useLogoutRequestMutation,
} from '@/redux/query/apis/auth/authApi';
import { removeUser, userSelector } from '@/redux/slices/user';
import { showToastError } from '@/utils/toastUtils';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(userSelector).user;
  const scrollToMealPlan = useCallback(() => {
    const mealPlanSection = document.getElementById('try-plan');
    if (mealPlanSection) {
      mealPlanSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  const [logout, { isLoading }] = useLogoutRequestMutation();

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout().unwrap();
      if (response.code === HTTP_STATUS.OK) {
        dispatch(authApi.util.resetApiState());
        dispatch(removeUser());
        navigate({ to: PATH.HOME });
      }
    } catch {
      showToastError('Logout failed. Please try again.');
    }
  }, [dispatch, logout, navigate]);

  return (
    <header className='flex w-full items-center justify-center border-b border-black/8 px-0 lg:px-4 xl:px-28'>
      <div className='m-auto flex h-20 w-full items-center justify-between'>
        <Link to={PATH.HOME} className='text-lg font-bold text-gray-800'>
          <img
            src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png'
            alt='Logo'
            className='w-36 object-cover'
          />
        </Link>

        <NavigationHeader />

        <div className='flex items-center gap-2'>
          {user.id ? (
            <>
              <Button className='bg-primary hover:bg-primary-400 h-10 w-32 rounded-full border-none px-5 py-2.5 text-base font-bold text-black'>
                <Link to={PATH.MEAL_PLAN} className='flex items-center gap-1'>
                  <span className='font-bold'>Plan Now</span>
                </Link>
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleLogout}
                className='h-10 rounded-full border border-transparent bg-white px-5 py-2.5 text-base text-gray-600 hover:border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400'
              >
                <span className='flex items-center gap-1 font-medium'>
                  {isLoading ? 'Logging out...' : 'Log Out'}
                  {!isLoading && <FaArrowRight className='h-4 w-4' />}
                </span>
              </Button>
            </>
          ) : (
            <>
              <Button
                className='bg-primary hover:bg-primary-400 h-10 w-32 rounded-full border-none px-5 py-2.5 text-base font-bold text-black'
                onClick={scrollToMealPlan}
              >
                Try Plan
              </Button>
              <Button className='h-10 rounded-full border border-transparent bg-white px-5 py-2.5 text-base text-gray-600 hover:border-gray-300'>
                <Link to={PATH.LOGIN} className='flex items-center gap-1'>
                  <span className='font-medium'>Log In</span>
                  <FaArrowRight className='h-4 w-4' />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
