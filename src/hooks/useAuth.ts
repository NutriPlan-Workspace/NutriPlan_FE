import { useNavigate } from '@tanstack/react-router';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { PATH } from '@/constants/path';
import { useToast } from '@/contexts/ToastContext';
import {
  useLoginRequestMutation,
  useRegisterRequestMutation,
} from '@/redux/query/apis/auth/authApi';
import type { ApiResponse } from '@/types/apiResponse';
import type { LoginData, RegisterData } from '@/types/auth';
import { navigateAfterLogin } from '@/utils/route';

export const useLogin = () => {
  const navigate = useNavigate();
  const { showToastError } = useToast();
  const [loginRequest, { isLoading }] = useLoginRequestMutation();

  const login = async (data: LoginData) => {
    try {
      const response = await loginRequest(data).unwrap();
      if (response?.code === HTTP_STATUS.OK) {
        navigateAfterLogin(response, navigate);
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
  const navigate = useNavigate();
  const { showToastError, showToastSuccess } = useToast();
  const [registerRequest, { isLoading }] = useRegisterRequestMutation();

  const register = async (data: RegisterData) => {
    try {
      const response = await registerRequest(data).unwrap();
      if (response?.code === HTTP_STATUS.CREATED) {
        showToastSuccess(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
        navigate({ to: PATH.LOGIN });
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
