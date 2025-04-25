import React from 'react';
import { FaPencil } from 'react-icons/fa6';
import { MdDelete, MdOutlinePushPin } from 'react-icons/md';
import { Button, Typography } from 'antd';

const { Paragraph } = Typography;

interface ActionButtonsProps {
  isFavorite: boolean;
  onEdit: () => void;
  onSetAsRecurring: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDelete,
  onEdit,
  onSetAsRecurring,
  isFavorite,
}) => (
  <div className='mt-8 flex items-center gap-2'>
    {!isFavorite && (
      <Button
        className='hover:border-primary flex items-center gap-2 hover:text-black'
        onClick={onEdit}
      >
        <FaPencil />
        <Paragraph className='m-0 text-sm font-thin'>Edit</Paragraph>
      </Button>
    )}
    <Button
      className='hover:border-primary flex items-center gap-2 hover:text-black'
      onClick={onSetAsRecurring}
    >
      <MdOutlinePushPin />
      <Paragraph className='m-0 text-sm font-thin'>Set as Recurring</Paragraph>
    </Button>
    {!isFavorite && (
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
