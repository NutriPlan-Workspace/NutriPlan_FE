import React from 'react';
import { IoMdMore } from 'react-icons/io';
import { Button, Dropdown, MenuProps } from 'antd';

interface DropDownProps {
  menuItems: MenuProps['items'];
}
const DropDown: React.FC<DropDownProps> = ({ menuItems }) => (
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
