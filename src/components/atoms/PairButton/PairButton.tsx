import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, MenuProps } from 'antd';

import DropDown from '@/atoms/DropDown/DropDown';
import { cn } from '@/helpers/helpers';

interface PairButtonProps {
  isHovered: boolean;
  menuItems: MenuProps['items'];
}

const PairButton: React.FC<PairButtonProps> = ({ isHovered, menuItems }) => (
  <div
    className={cn(
      'flex items-center justify-center transition-all duration-200',
      {
        'opacity-0': !isHovered,
      },
    )}
  >
    <Button
      // TODO: IMPLEMENT AUTO GENERATE MEAL PLAN
      onClick={(e) => e.preventDefault()}
      type='text'
      shape='circle'
      icon={<HiOutlineArrowPath className='text-xl' />}
    />
    <DropDown menuItems={menuItems} />
  </div>
);

export default PairButton;
