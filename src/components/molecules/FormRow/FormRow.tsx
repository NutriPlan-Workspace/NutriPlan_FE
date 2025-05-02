import React, { ReactNode } from 'react';
import { Typography } from 'antd';

import { cn } from '@/helpers/helpers';

const { Paragraph } = Typography;

export interface FormRowProps {
  label: string;
  children: ReactNode;
  isEnd?: boolean;
  className?: string;
  labelClassName?: string;
  contentClassName?: string;
}

const FormRow: React.FC<FormRowProps> = ({
  label,
  children,
  isEnd = false,
  className = '',
  labelClassName = '',
  contentClassName = '',
}) => (
  <div
    className={cn(
      'flex items-start justify-between py-3',
      !isEnd && 'border-b border-b-black/10',
      className,
    )}
  >
    <Paragraph className={`m-0 ${labelClassName}`}>{label}</Paragraph>
    <div className={`min-w-[200px] ${contentClassName}`}>{children}</div>
  </div>
);

export default FormRow;
