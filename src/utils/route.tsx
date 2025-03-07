import { redirect } from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { Role } from '@/types/user.types';
// TODO: Implement API RTK Query then uncomment this line
// import { authApi } from '@/store/authApi'; // API RTK Query để gọi /auth/me

async function getUserData() {
  // TODO: Implement API RTK Query then uncomment this line and remove the next line
  // const response = await authApi.endpoints.getUser.initiate();
  const response = {
    data: { id: '67c735126ba125117749e574', name: 'minh', role: Role.USER },
  };
  return response?.data || null;
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
  if (user)
    throw redirect({
      to: user.role === Role.ADMIN ? PATH.ADMIN : PATH.HOME,
    });
  return {};
};
