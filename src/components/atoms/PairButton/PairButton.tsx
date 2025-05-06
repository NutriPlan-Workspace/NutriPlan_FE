import React from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { Button, MenuProps } from 'antd';

import DropDown from '@/atoms/DropDown/DropDown';
import { cn } from '@/helpers/helpers';
import { useAutoGenerateMealPlanMutation } from '@/redux/query/apis/mealPlan/mealPlanApi';

interface PairButtonProps {
  mealDate: Date;
  isHovered: boolean;
  menuItems: MenuProps['items'];
}

const PairButton: React.FC<PairButtonProps> = ({
  isHovered,
  menuItems,
  mealDate,
}) => {
  const [autoGenerateMealPlan] = useAutoGenerateMealPlanMutation();
  return (
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
        onClick={async (e) => {
          e.preventDefault();
          try {
            await autoGenerateMealPlan({
              date: mealDate.toISOString(),
            }).unwrap();
          } catch (err) {
            console.error('Auto generate failed:', err);
          }
        }}
        type='text'
        shape='circle'
        icon={<HiOutlineArrowPath className='text-xl' />}
      />
      <DropDown menuItems={menuItems} />
    </div>
  );
};

export default PairButton;
