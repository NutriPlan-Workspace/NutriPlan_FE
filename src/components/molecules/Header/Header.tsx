import React, { useCallback } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useRouterState } from '@tanstack/react-router';

import { Button } from '@/atoms/Button';
import { NavigationHeader } from '@/atoms/NavigationHeader';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { PATH } from '@/constants/path';
import { Role } from '@/constants/role';
import {
  authApi,
  useLogoutRequestMutation,
} from '@/redux/query/apis/auth/authApi';
import { removeUser, userSelector } from '@/redux/slices/user';
import { showToastError } from '@/utils/toastUtils';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useSelector(userSelector).user;
  const scrollToMealPlan = useCallback(() => {
    const mealPlanSection = document.getElementById('try-plan');
    if (mealPlanSection) {
      mealPlanSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleTryPlanner = useCallback(() => {
    if (pathname === PATH.HOME) {
      scrollToMealPlan();
      return;
    }
    navigate({ to: PATH.HOME, hash: 'try-plan' });
  }, [navigate, pathname, scrollToMealPlan]);
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
    <header className='sticky top-0 z-40 w-full border-b border-white/60 bg-white/80 backdrop-blur'>
      <div className='mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10'>
        <Link to={PATH.HOME} className='flex items-center gap-3'>
          <img
            src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png'
            alt='Logo'
            className='w-36 object-cover'
          />
          <span className='hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-emerald-700 uppercase md:inline-flex'>
            Smart nutrition
          </span>
        </Link>

        <div className='hidden lg:flex'>
          <NavigationHeader />
        </div>

        <div className='flex items-center gap-2'>
          {user.id ? (
            <>
              {user.role === Role.ADMIN && (
                <Button className='h-10 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100'>
                  <Link to={PATH.ADMIN} className='flex items-center gap-1'>
                    <span className='font-semibold'>Admin</span>
                  </Link>
                </Button>
              )}
              <Button className='bg-primary hover:bg-primary-400 h-10 rounded-full border-none px-5 py-2.5 text-sm font-bold text-black'>
                <Link to={PATH.MEAL_PLAN} className='flex items-center gap-1'>
                  <span className='font-bold'>Open Planner</span>
                </Link>
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleLogout}
                className='h-10 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-600 hover:border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400'
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
                className='bg-primary hover:bg-primary-400 h-10 rounded-full border-none px-5 py-2.5 text-sm font-bold text-black'
                onClick={handleTryPlanner}
              >
                Try Planner
              </Button>
              <Button className='h-10 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-600 hover:border-gray-300'>
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
