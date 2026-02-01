import React from 'react';
import { FaCopy, FaPencil } from 'react-icons/fa6';
import { MdDelete, MdOutlinePushPin } from 'react-icons/md';
import { Button, Typography } from 'antd';

const { Paragraph } = Typography;

interface ActionButtonsProps {
  isFavorite: boolean;
  isExclusion?: boolean;
  isCurated?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly';
  onEdit: () => void;
  onSetAsRecurring: () => void;
  onMakeCopy?: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDelete,
  onEdit,
  onSetAsRecurring,
  isFavorite,
  isExclusion = false,
  isCurated = false,
  isRecurring,
  recurringFrequency,
  onMakeCopy,
}) => (
  <div className='mt-8 flex items-center gap-2'>
    {isCurated && onMakeCopy && (
      <Button
        className='hover:border-primary flex items-center gap-2 hover:text-black'
        onClick={onMakeCopy}
      >
        <FaCopy />
        <Paragraph className='m-0 text-sm font-thin'>Make a copy</Paragraph>
      </Button>
    )}
    {!isFavorite && !isExclusion && !isCurated && (
      <Button
        className='hover:border-primary flex items-center gap-2 hover:text-black'
        onClick={onEdit}
      >
        <FaPencil />
        <Paragraph className='m-0 text-sm font-thin'>Edit</Paragraph>
      </Button>
    )}
    {!isExclusion && !isCurated && (
      <Button
        className={
          isRecurring
            ? 'border-secondary-600 text-secondary-600 hover:border-secondary-700 hover:text-secondary-700 flex items-center gap-2'
            : 'hover:border-primary flex items-center gap-2 hover:text-black'
        }
        onClick={onSetAsRecurring}
      >
        <MdOutlinePushPin />
        <Paragraph
          className={`m-0 text-sm font-thin ${isRecurring ? 'text-secondary-600' : ''}`}
        >
          {isRecurring && recurringFrequency
            ? `Recurring (${recurringFrequency})`
            : 'Set as Recurring'}
        </Paragraph>
      </Button>
    )}
    {!isFavorite && !isExclusion && !isCurated && (
      <Button
        className='hover:border-primary flex items-center gap-2 hover:text-black'
        onClick={onDelete}
      >
        <MdDelete />
        <Paragraph className='m-0 text-sm font-thin'>Delete</Paragraph>
      </Button>
    )}
  </div>
);

export default ActionButtons;
