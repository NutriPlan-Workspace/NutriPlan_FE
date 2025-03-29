import { useDispatch } from 'react-redux';
import { useRouter } from '@tanstack/react-router';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Role } from '@/constants/role';
import { useToast } from '@/contexts/ToastContext';
import {
  useLoginRequestMutation,
  useRegisterRequestMutation,
} from '@/redux/query/apis/auth/authApi';
import { setUser } from '@/redux/slices/user';
import type { ApiResponse } from '@/types/apiResponse';
import type { LoginData, RegisterData } from '@/types/auth';
import { saveAuthToken, saveUserToStorage } from '@/utils/localStorage';

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToastError } = useToast();
  const [loginRequest, { isLoading }] = useLoginRequestMutation();

  const login = async (data: LoginData) => {
    try {
      const response = await loginRequest(data).unwrap();
      if (response?.code === HTTP_STATUS.OK) {
        saveUserToStorage(response.data.payload);
        saveAuthToken(response.data.accessToken);
        dispatch(setUser(response.data.payload));
        if (response.data.payload.role === Role.ADMIN) {
          router.navigate({ to: PATH.ADMIN });
        } else {
          // TODO: replace path in here for accuracy when user logined
          router.navigate({ to: PATH.MEAL_PLAN });
        }
      }
    } catch (error) {
      const apiError = (error as { data?: ApiResponse })?.data;
      showToastError(
        `${ERROR_MESSAGES.LOGIN_FAILED} ${apiError?.message || ERROR_MESSAGES.UNEXPECTED_ERROR}`,
      );
    }
  };

  return { login, isLoading };
};

export const useRegister = () => {
  const router = useRouter();
  const { showToastError, showToastSuccess } = useToast();
  const [registerRequest, { isLoading }] = useRegisterRequestMutation();

  const register = async (data: RegisterData) => {
    try {
      const response = await registerRequest(data).unwrap();
      if (response?.code === HTTP_STATUS.CREATED) {
        showToastSuccess(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
        router.navigate({ to: PATH.LOGIN });
      }
    } catch (error) {
      const apiError = (error as { data?: ApiResponse })?.data;
      showToastError(
        `${ERROR_MESSAGES.REGISTER_FAILED} ${apiError?.message || ERROR_MESSAGES.UNEXPECTED_ERROR}`,
      );
    }
  };

  return { register, isLoading };
};
