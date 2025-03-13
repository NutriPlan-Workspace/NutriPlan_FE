import { redirect } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import type { User } from '@/types/user.types';
import { Role } from '@/types/user.types';
// TODO: Implement API RTK Query then uncomment this line
// import { authApi } from '@/store/authApi'; // API RTK Query để gọi /auth/me

async function getUserData(): Promise<User | null> {
  // TODO: Implement API RTK Query then uncomment this line and remove the next line
  // const response = await authApi.endpoints.getUser.initiate();
  const response = {
    data: {
      id: '67c735126ba125117749e574',
      fullName: 'minh',
      role: Role.USER,
      email: 'minhh13@gmail.com',
    },
  };
  return response?.data;
}

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

export const handleLoginRoute = async () => {
  const user = await getUserData();

  if (!user) return;

  throw redirect({ to: user.role === Role.ADMIN ? PATH.ADMIN : PATH.HOME });
};
