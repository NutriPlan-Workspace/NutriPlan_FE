import { useRouter } from '@tanstack/react-router';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Role } from '@/constants/role';
import { useToast } from '@/contexts/ToastContext';
import { useLoginRequestMutation } from '@/redux/query/apis/auth/authApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { LoginData } from '@/types/auth';
import { saveAuthToken, saveUserToStorage } from '@/utils/localStorage';

export const useLogin = () => {
  const router = useRouter();
  const { showToastError } = useToast();
  const [loginRequest, { isLoading }] = useLoginRequestMutation();

  const login = async (data: LoginData) => {
    try {
      const response = await loginRequest(data).unwrap();

      if (response?.code === HTTP_STATUS.OK) {
        saveUserToStorage(response.data.payload);
        saveAuthToken(response.data.accessToken);
        if (response.data.payload.role === Role.ADMIN) {
          router.navigate({ to: PATH.ADMIN });
        } else {
          // TODO: replace path in here for accuracy when user logined
          router.navigate({ to: PATH.HOME });
        }
      }
    } catch (error) {
      const apiError = error as ApiResponse;
      showToastError(
        `${ERROR_MESSAGES.loginFailed} ${apiError?.data?.message || ERROR_MESSAGES.unexpectedError}`,
      );
    }
  };

  return { login, isLoading };
};
