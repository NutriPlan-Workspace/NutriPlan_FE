import React from 'react';
import {
  HiOutlineAdjustmentsVertical,
  HiOutlineArchiveBoxArrowDown,
  HiOutlineArchiveBoxXMark,
} from 'react-icons/hi2';
import { IoMdMore } from 'react-icons/io';
import { Button, Dropdown, MenuProps } from 'antd';

const menuItems: MenuProps['items'] = [
  {
    label: (
      <div className='flex items-center gap-2'>
        <HiOutlineArchiveBoxArrowDown className='text-xl' />
        <span>Add Food</span>
      </div>
    ),
    key: '0',
  },
  {
    label: (
      <div className='flex items-center gap-2'>
        <HiOutlineArchiveBoxXMark className='text-xl' />
        <span>Clear Food</span>
      </div>
    ),
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: (
      <div className='flex items-center gap-2'>
        <HiOutlineAdjustmentsVertical className='text-xl' />
        <span>Edit Meal Setting</span>
      </div>
    ),
    key: '2',
  },
];

const DropDown: React.FC = () => (
  <Dropdown menu={{ items: menuItems }} trigger={['click']}>
    <Button
      onClick={(e) => e.preventDefault()}
      type='text'
      shape='circle'
      icon={<IoMdMore className='text-xl' />}
    />
  </Dropdown>
);

export default DropDown;
