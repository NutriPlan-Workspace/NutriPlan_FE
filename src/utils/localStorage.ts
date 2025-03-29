import { TOKEN_KEY, USER_KEY } from '@/constants/localStorage';
import type { User } from '@/types/user';

export const saveUserToStorage = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserFromStorage = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  try {
    return user ? (JSON.parse(user) as User) : null;
  } catch {
    return null;
  }
};

export const saveAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY);

export const clearStorage = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
