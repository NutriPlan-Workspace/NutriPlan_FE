import { categoryKeysMap } from '@/constants/categoryKeys';
import {
  CATEGORIES_BY_GROUP,
  MAIN_ITEM_CATEGORIES,
} from '@/constants/foodCategories';
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

export function getRelatedCategories(categoryKey: number) {
  const relatedItems = [categoryKey];
  CATEGORIES_BY_GROUP.forEach((group) => {
    if (group.mainItem === categoryKey) {
      relatedItems.push(...group.items);
    }
  });
  return relatedItems;
}

export function getNewExclusions(
  categoryKey: number,
  exclusions: Set<number>,
): Set<number> {
  const newExclusions = new Set(exclusions);
  if (newExclusions.has(categoryKey)) {
    newExclusions.delete(categoryKey);
  } else {
    newExclusions.add(categoryKey);
  }

  if (MAIN_ITEM_CATEGORIES.has(categoryKey)) {
    const relatedGroup = CATEGORIES_BY_GROUP.find(
      (group) => group.mainItem === categoryKey,
    );

    if (relatedGroup) {
      if (exclusions.has(categoryKey)) {
        relatedGroup.items.forEach((item) => {
          newExclusions.delete(item);
        });
      } else {
        relatedGroup.items.forEach((item) => {
          newExclusions.add(item);
        });
      }
    }
    return newExclusions;
  }

  const relatedGroup = CATEGORIES_BY_GROUP.find((group) =>
    group.items.includes(categoryKey),
  );
  if (!relatedGroup) {
    return newExclusions;
  }

  const { items, mainItem } = relatedGroup;
  const allItemsChecked = items.every((item) => newExclusions.has(item));
  if (mainItem !== undefined && allItemsChecked) {
    newExclusions.add(mainItem);
  } else if (mainItem && newExclusions.has(mainItem) && !allItemsChecked) {
    newExclusions.delete(mainItem);
  }
  return newExclusions;
}

export function getYourExclusions(
  exclusions: Set<number>,
  excludedByDietFull: Set<number>,
): Set<number> {
  const updatedExclusions = new Set(exclusions);

  CATEGORIES_BY_GROUP.forEach((group) => {
    const { mainItem, items } = group;

    if (mainItem !== undefined && updatedExclusions.has(mainItem)) {
      items.forEach((item) => {
        updatedExclusions.delete(item);
      });
    }
  });

  excludedByDietFull.forEach((item) => {
    updatedExclusions.delete(item);
  });

  return updatedExclusions;
}
