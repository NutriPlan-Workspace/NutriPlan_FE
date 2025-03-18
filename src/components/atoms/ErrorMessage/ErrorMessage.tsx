import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { AnimatePresence, motion } from 'motion/react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <AnimatePresence>
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className='flex-start text-error mt-1 -ml-1 flex items-start gap-1 text-[15px]'
    >
      <AiOutlineExclamationCircle className='h-6 w-6 overflow-visible' />
      <span className='overflow-visible whitespace-nowrap'>{message}</span>
    </motion.p>
  </AnimatePresence>
);

export default ErrorMessage;
