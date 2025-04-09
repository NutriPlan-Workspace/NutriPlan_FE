import React from 'react';
import { CiCircleMore } from 'react-icons/ci';

import { Button } from '@/atoms/Button';
import { MenuOption } from '@/atoms/MenuOption';
import { MenuSideAddFood } from '@/molecules/SideAddFood';

interface TabActionMenuProps {
  menuItem: boolean;
  setMenuItem: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTabLabel: string;
  onSelect: (key: string) => void;
  dropDownRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

const TabActionMenu: React.FC<TabActionMenuProps> = ({
  menuItem,
  setMenuItem,
  selectedTabLabel,
  onSelect,
  dropDownRef,
  menuRef,
}) => (
  <div ref={dropDownRef} className='absolute top-0 right-0'>
    <Button
      className='hover:text-primary z-50 flex items-center justify-center border-none'
      onClick={() => setMenuItem((prev) => !prev)}
    >
      <CiCircleMore className='mt-3 h-5 w-5' />
      {menuItem && (
        <div ref={menuRef} className='absolute top-10 right-0 z-50 rounded-sm'>
          <MenuOption
            items={MenuSideAddFood}
            onSelect={onSelect}
            selectedOption={selectedTabLabel}
          />
        </div>
      )}
    </Button>
  </div>
);

export default TabActionMenu;
