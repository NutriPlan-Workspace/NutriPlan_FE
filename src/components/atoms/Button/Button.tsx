import React from 'react';
import { Button as AntdButton, ButtonProps as AntdButtonProps } from 'antd';

import { cn } from '@/helpers/helpers';

interface ButtonProps extends AntdButtonProps {
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <AntdButton className={cn('font-display rounded-full', className)} {...props}>
    {children}
  </AntdButton>
);

export default Button;
