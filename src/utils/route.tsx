import { redirect } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Role } from '@/constants/role';
import { authApi } from '@/redux/query/apis/auth/authApi';
import { store } from '@/redux/store';
import type { AuthResponse } from '@/types/auth';

export const getUserData = async () => {
  const stateUser = store.getState().user.user;
  if (stateUser?.id && stateUser.role !== Role.GUEST) {
    return stateUser;
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken && !refreshToken) {
    return null;
  }

  try {
    const { data } = await store.dispatch(authApi.endpoints.getUser.initiate());
    if (data?.data) {
      return data.data;
    }
  } catch {
    // ignore error
  }
  return null;
};

export const handleAdminRoute = async () => {
  const user = await getUserData();

  if (!user)
    throw redirect({ to: PATH.LOGIN, search: { redirect: location.href } });
  if (user.role !== Role.ADMIN) throw redirect({ to: PATH.UNAUTHORIZED });

  return {};
};

export const handleUserRoute = async () => {
  const user = await getUserData();

  if (!user)
    throw redirect({ to: PATH.LOGIN, search: { redirect: location.href } });

  return {};
};

export const handlePublicRoute = async () => {
  await getUserData();
};

export const handleLoginRoute = async () => {
  const user = await getUserData();

  if (!user) return;

  throw redirect({
    to: user.role === Role.ADMIN ? PATH.ADMIN : PATH.MEAL_PLAN,
  });
};

export const navigateAfterLogin = (
  response: AuthResponse,
  navigate: (args: { to: string }) => void,
) => {
  try {
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.refreshToken;

    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  } catch {
    // ignore storage errors
  }

  navigate({
    to: response.data.payload.role === Role.ADMIN ? PATH.ADMIN : PATH.MEAL_PLAN,
  });
};
