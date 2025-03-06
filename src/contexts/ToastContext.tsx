import { createContext, ReactNode, useContext } from 'react';
import { Id, ToastContainer } from 'react-toastify';

import {
  showToastError,
  showToastInfo,
  showToastLoading,
  showToastSuccess,
  showToastUpdateLoading,
  showToastWarning,
} from '@/utils/toastUtils';

interface ToastContextType {
  showToastSuccess: (content: string) => void;
  showToastError: (content: string) => void;
  showToastInfo: (content: string) => void;
  showToastWarning: (content: string) => void;
  showToastLoading: (content: string) => Id;
  showToastUpdateLoading: (
    idLoading: Id,
    content: string,
    type: 'success' | 'error',
  ) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => (
  <ToastContext.Provider
    value={{
      showToastSuccess,
      showToastError,
      showToastInfo,
      showToastWarning,
      showToastLoading,
      showToastUpdateLoading,
    }}
  >
    <ToastContainer />
    {children}
  </ToastContext.Provider>
);

export default ToastProvider;
