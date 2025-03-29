import { useDispatch, useSelector } from 'react-redux';

import { setUser, userSelector } from '@/redux/slices/user';
import type { User } from '@/types/user';
import { getUserFromStorage } from '@/utils/localStorage';

export const useGetUserData = (): User | null => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  if (user.id) return user;

  const storedUser = getUserFromStorage();
  if (storedUser) {
    dispatch(setUser(storedUser));
    return storedUser;
  }

  return null;
};
