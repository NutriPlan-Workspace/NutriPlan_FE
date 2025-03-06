import { Id, toast } from 'react-toastify';
import { cn } from 'helpers/helpers';

import 'react-toastify/dist/ReactToastify.css';

type ToastType = keyof Pick<
  typeof toast,
  'success' | 'error' | 'info' | 'warning'
>;

const toastStyles: Record<ToastType, string> = {
  success: 'text-green-600 border-[#97f8ae]',
  error: 'text-red-500 border-[#f6a3ab]',
  info: 'text-blue-500 border-[#87e3f1]',
  warning: 'text-yellow-500 border-[#ffe28c]',
};

const showToast = (content: string, type: ToastType): void => {
  toast[type](content, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: cn(
      toastStyles[type],
      'border-l-4 shadow-lg rounded-lg p-4 text-sm flex items-center gap-3 animate-fadeInUp',
    ),
  });
};

export const showToastSuccess = (content: string): void =>
  showToast(content, 'success');
export const showToastError = (content: string): void =>
  showToast(content, 'error');
export const showToastInfo = (content: string): void =>
  showToast(content, 'info');
export const showToastWarning = (content: string): void =>
  showToast(content, 'warning');

export const showToastLoading = (content: string): Id =>
  toast.loading(content, {
    position: 'top-right',
    className: 'text-white text-sm rounded-lg p-4 shadow-lg animate-fadeInUp',
  });

export const showToastUpdateLoading = (
  toastId: Id,
  content: string,
  type: 'success' | 'error',
): void => {
  toast.update(toastId, {
    render: content,
    type,
    isLoading: false,
    autoClose: 3000,
    className: cn(
      'border-l-4 shadow-lg rounded-lg p-4 text-sm flex items-center gap-3 animate-fadeInUp',
      type === 'success'
        ? 'text-green-600 border-green-300'
        : 'text-red-500 border-red-300',
    ),
  });
};
