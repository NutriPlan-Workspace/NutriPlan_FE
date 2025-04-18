import {
  HiOutlineArchiveBoxXMark,
  HiOutlineDocumentDuplicate,
  HiOutlineStar,
} from 'react-icons/hi2';
import { MenuProps } from 'antd';

interface MenuItemProps {
  onRemoveFood?: (index: number) => void;
  onDuplicateFood?: (index: number) => void;
  index: number;
}

export const getMenuItems = ({
  onRemoveFood,
  onDuplicateFood,
  index,
}: MenuItemProps): MenuProps['items'] | undefined => {
  if (onRemoveFood && onDuplicateFood) {
    return [
      {
        key: '0',
        label: 'Add to Favorite',
        icon: <HiOutlineStar />,
      },
      {
        key: '1',
        label: 'Remove Food',
        icon: <HiOutlineArchiveBoxXMark />,
        onClick: () => onRemoveFood(index),
      },
      { type: 'divider' },
      {
        key: '2',
        label: 'Duplicate this Food',
        icon: <HiOutlineDocumentDuplicate />,
        onClick: () => onDuplicateFood(index),
      },
    ];
  }

  return undefined;
};
