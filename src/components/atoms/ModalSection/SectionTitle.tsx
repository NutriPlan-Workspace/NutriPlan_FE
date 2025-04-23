import React from 'react';
import { PiCaretDownBold, PiCaretRightBold } from 'react-icons/pi';
import { Typography } from 'antd';

const { Title } = Typography;

interface SectionTitleProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  isOpen,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className='flex max-w-[200px] items-center gap-4 border-none px-0 py-3 hover:text-black'
  >
    <Title level={5} className='mb-0'>
      {title}
    </Title>
    {isOpen ? (
      <PiCaretDownBold className='text-lg' />
    ) : (
      <PiCaretRightBold className='text-lg' />
    )}
  </button>
);

export default SectionTitle;
