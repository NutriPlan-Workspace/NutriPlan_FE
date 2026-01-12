import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, MenuProps } from 'antd';

import DropDown from '@/atoms/DropDown/DropDown';
import { cn } from '@/helpers/helpers';

interface PairButtonProps {
  isHovered: boolean;
  menuItems: MenuProps['items'];
  onRotate?: () => void;
  isRotating?: boolean;
}

const PairButton: React.FC<PairButtonProps> = ({
  isHovered,
  menuItems,
  onRotate,
  isRotating = false,
}) => (
  <div
    className={cn(
      'flex items-center justify-center transition-all duration-200',
      {
        'opacity-0': !isHovered,
      },
    )}
  >
    <Button
      onClick={(e) => {
        e.preventDefault();
        onRotate?.();
      }}
      type='text'
      shape='circle'
      icon={<HiOutlineArrowPath className='text-xl' />}
      loading={isRotating}
    />
    <DropDown menuItems={menuItems} />
  </div>
);

export default PairButton;
