import { redirect } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Role } from '@/constants/role';
import { setUser } from '@/redux/slices/user';
import type { RootState } from '@/redux/store';
import { store } from '@/redux/store';
import { getUserFromStorage } from '@/utils/localStorage';

export const getUserData = () => {
  const state: RootState = store.getState();
  const user = state.user;
  if (user.role !== Role.GUEST) return user;

  const storedUser = getUserFromStorage();
  if (storedUser) {
    store.dispatch(setUser(storedUser));
    return storedUser;
  }

  return null;
};

export const handleAdminRoute = async () => {
  const user = getUserData();
  if (!user)
    throw redirect({ to: PATH.LOGIN, search: { redirect: location.href } });
  if (user.role !== Role.ADMIN) throw redirect({ to: PATH.UNAUTHORIZED });
  return {};
};

export const handleUserRoute = async () => {
  const user = getUserData();
  if (!user)
    throw redirect({ to: PATH.LOGIN, search: { redirect: location.href } });
  return {};
};

export const handleLoginRoute = async () => {
  const user = getUserData();

  if (!user) return;

  throw redirect({ to: user.role === Role.ADMIN ? PATH.ADMIN : PATH.HOME });
};
