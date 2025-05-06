import {
  HiOutlineArchiveBoxXMark,
  HiOutlineDocumentDuplicate,
  HiOutlineStar,
} from 'react-icons/hi2';
import { MenuProps } from 'antd';

import { cn } from '@/helpers/helpers';

interface MenuItemProps {
  isFavorite: boolean;
  onAddToFavorite: () => void;
  onRemoveFromFavorite: () => void;
  onRemoveFood?: (index: number) => void;
  onDuplicateFood?: (index: number) => void;
  index: number;
}

export const getMenuItems = ({
  isFavorite,
  onAddToFavorite,
  onRemoveFromFavorite,
  onRemoveFood,
  onDuplicateFood,
  index,
}: MenuItemProps): MenuProps['items'] | undefined => {
  if (onRemoveFood && onDuplicateFood) {
    return [
      {
        key: '0',
        label: isFavorite ? 'Remove from Favorite' : 'Add to Favorite',
        icon: (
          <HiOutlineStar
            className={cn(
              'text-base',
              isFavorite ? 'text-yellow-500' : 'text-gray-500',
            )}
          />
        ),
        onClick: isFavorite ? onRemoveFromFavorite : onAddToFavorite,
      },
      {
        key: '1',
        label: 'Remove Food',
        icon: <HiOutlineArchiveBoxXMark className='text-base' />,
        onClick: () => onRemoveFood(index),
      },
      { type: 'divider' },
      {
        key: '2',
        label: 'Duplicate this Food',
        icon: <HiOutlineDocumentDuplicate className='text-base' />,
        onClick: () => onDuplicateFood(index),
      },
    ];
  }

  return undefined;
};
