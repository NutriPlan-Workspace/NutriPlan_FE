import React from 'react';
import { Button } from 'antd';

interface PopupButtonProps {
  onClick: () => void;
}

const PopupButton: React.FC<PopupButtonProps> = ({ onClick }) => (
  <div className='m-10 flex items-center justify-center rounded-lg border-2 border-[#ffc84e] p-3'>
    <p className='mr-auto'>
      Your dietary requirements have changed. You may want to adjust your
      Nutrition Targets to better fit your new goals.
    </p>
    <Button
      onClick={onClick}
      className='border-none bg-[#ffc84e] px-6 py-5 text-[16px] font-bold text-black hover:bg-[#ffb81c]'
    >
      Update Nutrition Targets
    </Button>
  </div>
);

export default PopupButton;
