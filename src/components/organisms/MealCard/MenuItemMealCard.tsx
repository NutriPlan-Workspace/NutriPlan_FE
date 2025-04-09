import {
  HiOutlineArchiveBoxXMark,
  HiOutlineDocumentDuplicate,
  HiOutlineStar,
} from 'react-icons/hi2';
import { MenuProps } from 'antd';

interface MenuItemProps {
  isAddFood: boolean;
  onRemoveFood?: (id: string) => void;
  onDuplicateFood?: (id: string) => void;
  mealItem: { _id: string };
}

export const getMenuItems = ({
  isAddFood,
  onRemoveFood,
  onDuplicateFood,
  mealItem,
}: MenuItemProps): MenuProps['items'] | undefined => {
  if (!isAddFood && onRemoveFood && onDuplicateFood) {
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
        onClick: () => onRemoveFood(mealItem._id),
      },
      { type: 'divider' },
      {
        key: '2',
        label: 'Duplicate this Food',
        icon: <HiOutlineDocumentDuplicate />,
        onClick: () => onDuplicateFood(mealItem._id),
      },
    ];
  }

  return undefined;
};
