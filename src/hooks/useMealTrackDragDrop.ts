import { useCallback, useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import { DragData } from '@/types/dragDrop';
import type { Food } from '@/types/food';
import type { MealItems } from '@/types/mealPlan';
import { convertFoodCardToMealPlanFood } from '@/utils/mealPlan';

import { useDragDropLogic } from './useDragDropLogic';

export const useMealTrackDragDrop = () => {
  const {
    insertDestination,
    removeSource,
    removeSourceAndInsertDestinationSameDay,
    removeSourceAndInsertDestinationDiffDay,
    findDestinationIndex,
  } = useDragDropLogic();

  const handleDropLogic = useCallback(
    ({
      foodCard,
      sourceMealDate,
      sourceMealType,
      sourceIndex,
      destinationMealDate,
      destinationMealType,
      destinationIndex,
    }: {
      foodCard?: Food;
      sourceMealDate?: string;
      sourceMealType?: keyof MealItems;
      sourceIndex?: number | undefined;
      destinationMealDate?: string;
      destinationMealType?: keyof MealItems;
      destinationIndex?: number;
    }) => {
      if (
        sourceMealDate === destinationMealDate &&
        sourceMealType === destinationMealType &&
        sourceIndex === destinationIndex
      ) {
        return;
      }
      if (
        destinationMealDate === undefined ||
        destinationMealType === undefined ||
        destinationIndex === undefined
      ) {
        removeSource({
          mealDate: sourceMealDate ?? '',
          mealType: sourceMealType ?? 'breakfast',
          index: sourceIndex ?? 0,
        });
        return;
      }
      if (foodCard) {
        const convertedFoodCard = convertFoodCardToMealPlanFood(foodCard);

        insertDestination({
          mealDate: destinationMealDate,
          mealType: destinationMealType,
          mealCard: convertedFoodCard,
          destinationIndex,
        });
        return;
      }

      if (sourceMealDate === undefined && sourceMealType === undefined) {
        removeSourceAndInsertDestinationSameDay({
          mealDate: destinationMealDate,
          sourceMealType: destinationMealType,
          sourceIndex: sourceIndex ?? 0,
          destinationMealType: destinationMealType,
          destinationIndex,
        });
        return;
      }

      if (sourceMealDate === undefined && sourceMealType) {
        removeSourceAndInsertDestinationSameDay({
          mealDate: destinationMealDate,
          sourceMealType: sourceMealType,
          sourceIndex: sourceIndex ?? 0,
          destinationMealType: destinationMealType,
          destinationIndex,
        });
        return;
      }

      removeSourceAndInsertDestinationDiffDay({
        sourceMealDate: sourceMealDate ?? '',
        sourceMealType: sourceMealType ?? 'breakfast',
        sourceIndex: sourceIndex ?? 0,
        destinationMealDate: destinationMealDate,
        destinationMealType: destinationMealType,
        destinationIndex,
      });
    },
    [
      insertDestination,
      removeSource,
      removeSourceAndInsertDestinationSameDay,
      removeSourceAndInsertDestinationDiffDay,
    ],
  );

  const handleDrop = useCallback(
    ({
      source,
      location,
    }: {
      source: { data: Record<string, unknown> };
      location: {
        current: { dropTargets: { data: Record<string, unknown> }[] };
      };
    }) => {
      const destination = location.current.dropTargets.length;

      if (!destination) return;
      const sourceData = source.data as DragData;

      /*
       * Two Draggable (source):
       * 1. MealCard
       * 2. FoodCardSideAdd
       *
       * MealBox and MealCard is also a drop target
       * 1. MealBox so destination is 1
       * 2. MealCard (inside MealBox) so destination is 2
       * 3. RemoveDropzone not inside MealBox or MealCard so destination is 1
       */
      if (
        destination === 1 &&
        (location.current.dropTargets[0].data as DragData).type ===
          'removeDropzone' &&
        sourceData.type === 'mealCard'
      ) {
        const mealCard = sourceData;
        handleDropLogic({
          sourceMealDate: mealCard.mealDate,
          sourceMealType: mealCard.mealType,
          sourceIndex: mealCard.index,
        });
        return;
      }
      if (destination === 1 && sourceData.type === 'foodCardSideAdd') {
        const foodCard = sourceData.food;
        const [destinationMealBoxRecord] = location.current.dropTargets;
        const destData = destinationMealBoxRecord.data as DragData;

        handleDropLogic({
          foodCard: foodCard,
          destinationMealDate: destData.mealDate,
          destinationMealType: destData.mealType,
          destinationIndex: -1,
        });
        return;
      }
      if (destination === 2 && sourceData.type === 'foodCardSideAdd') {
        const foodCard = sourceData.food;
        const destinationMealCardRecord = location.current.dropTargets[0];
        const destData = destinationMealCardRecord.data as DragData;
        const destinationMealCardIndex = destData.index ?? -1;
        const closestEdgeOfTarget = extractClosestEdge(
          destinationMealCardRecord.data,
        );
        const destinationIndex = findDestinationIndex({
          destinationMealCardIndex,
          closestEdgeOfTarget,
        });

        handleDropLogic({
          foodCard: foodCard,
          destinationMealDate: destData.mealDate,
          destinationMealType: destData.mealType,
          destinationIndex: destinationIndex,
        });
        return;
      }
      if (destination === 1 && sourceData.type === 'mealCard') {
        const [destinationMealBoxRecord] = location.current.dropTargets;
        const destData = destinationMealBoxRecord.data as DragData;
        const isSameMealDate = sourceData.mealDate === destData.mealDate;
        const isSameMealType = sourceData.mealType === destData.mealType;

        handleDropLogic({
          sourceMealDate: isSameMealDate ? undefined : sourceData.mealDate,
          sourceMealType:
            isSameMealDate && isSameMealType ? undefined : sourceData.mealType,
          sourceIndex: sourceData.index,
          destinationMealDate: destData.mealDate,
          destinationMealType: destData.mealType,
          destinationIndex: -1,
        });
        return;
      }
      if (destination === 2 && sourceData.type === 'mealCard') {
        const destinationMealCardRecord = location.current.dropTargets[0];
        const destData = destinationMealCardRecord.data as DragData;
        const destinationMealCardIndex = destData.index ?? -1;
        const closestEdgeOfTarget = extractClosestEdge(
          destinationMealCardRecord.data,
        );
        const isSameMealDate = sourceData.mealDate === destData.mealDate;
        const isSameMealType = sourceData.mealType === destData.mealType;

        const destinationIndex = findDestinationIndex({
          isSameMealBox: isSameMealDate && isSameMealType,
          sourceMealCardIndex: sourceData.index,
          destinationMealCardIndex,
          closestEdgeOfTarget,
        });
        handleDropLogic({
          sourceMealDate: isSameMealDate ? undefined : sourceData.mealDate,
          sourceMealType:
            isSameMealDate && isSameMealType ? undefined : sourceData.mealType,
          sourceIndex: sourceData.index,
          destinationMealDate: destData.mealDate,
          destinationMealType: destData.mealType,
          destinationIndex: destinationIndex,
        });
        return;
      }
    },
    [handleDropLogic, findDestinationIndex],
  );

  useEffect(() => monitorForElements({ onDrop: handleDrop }), [handleDrop]);
};
