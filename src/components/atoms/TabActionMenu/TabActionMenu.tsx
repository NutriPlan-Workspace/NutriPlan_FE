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
  <div ref={dropDownRef} className='relative flex items-center'>
    <Button
      className={
        'side-add-more-btn relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/65 p-0 text-slate-600 shadow-[0_10px_28px_-24px_rgba(16,24,40,0.55)] transition hover:bg-white/80 hover:text-slate-900'
      }
      onClick={() => setMenuItem((prev) => !prev)}
    >
      <CiCircleMore className='h-5 w-5' />
      {menuItem && (
        <div
          ref={menuRef}
          className='absolute top-[calc(100%+8px)] right-0 z-50 overflow-hidden rounded-2xl border border-black/10 bg-white/85 shadow-[0_18px_60px_-36px_rgba(16,24,40,0.55)] backdrop-blur-xl'
        >
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
