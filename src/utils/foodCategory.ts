import { categoryKeysMap } from '@/constants/categoryKeys';
import { MenuSideAddFood } from '@/molecules/SideAddFood';

export const reverseCategoryKeysMap: { [key: string]: string[] } =
  Object.entries(categoryKeysMap).reduce(
    (acc, [key, value]) => {
      if (!acc[value]) acc[value] = [];
      acc[value].push(key);
      return acc;
    },
    {} as { [key: string]: string[] },
  );

export const getMappedKey = (selectedKey: string) =>
  reverseCategoryKeysMap[selectedKey] || [selectedKey];

export const getItemsSelected = (selectedKey: string) => {
  const originalKeys = getMappedKey(selectedKey);
  const mappedKey = originalKeys[0];
  const selectedItem = MenuSideAddFood.find((item) => item.key === mappedKey);

  if (!selectedItem) return null;

  return {
    label: selectedItem.label,
    filter: categoryKeysMap[mappedKey] || 'default',
  };
};
