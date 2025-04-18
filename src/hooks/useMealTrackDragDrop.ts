import { useCallback, useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ source, location }: { source: any; location: any }) => {
      const destination = location.current.dropTargets.length;

      if (!destination) return;

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
        location.current.dropTargets[0].data.type === 'removeDropzone' &&
        source.data.type === 'mealCard'
      ) {
        const mealCard = source.data;
        handleDropLogic({
          sourceMealDate: mealCard.mealDate,
          sourceMealType: mealCard.mealType,
          sourceIndex: mealCard.index,
        });
        return;
      }
      if (destination === 1 && source.data.type === 'foodCardSideAdd') {
        const foodCard = source.data.food;
        const [destinationMealBoxRecord] = location.current.dropTargets;

        handleDropLogic({
          foodCard: foodCard,
          destinationMealDate: destinationMealBoxRecord.data.mealDate,
          destinationMealType: destinationMealBoxRecord.data.mealType,
          destinationIndex: -1,
        });
        return;
      }
      if (destination === 2 && source.data.type === 'foodCardSideAdd') {
        const foodCard = source.data.food;
        const destinationMealCardRecord = location.current.dropTargets[0];
        const destinationMealCardIndex = destinationMealCardRecord.data.index;
        const closestEdgeOfTarget = extractClosestEdge(
          destinationMealCardRecord.data,
        );
        const destinationIndex = findDestinationIndex({
          destinationMealCardIndex,
          closestEdgeOfTarget,
        });

        handleDropLogic({
          foodCard: foodCard,
          destinationMealDate: destinationMealCardRecord.data.mealDate,
          destinationMealType: destinationMealCardRecord.data.mealType,
          destinationIndex: destinationIndex,
        });
        return;
      }
      if (destination === 1 && source.data.type === 'mealCard') {
        const [destinationMealBoxRecord] = location.current.dropTargets;
        const isSameMealDate =
          source.data.mealDate === destinationMealBoxRecord.data.mealDate;
        const isSameMealType =
          source.data.mealType === destinationMealBoxRecord.data.mealType;

        handleDropLogic({
          sourceMealDate: isSameMealDate ? undefined : source.data.mealDate,
          sourceMealType:
            isSameMealDate && isSameMealType ? undefined : source.data.mealType,
          sourceIndex: source.data.index,
          destinationMealDate: destinationMealBoxRecord.data.mealDate,
          destinationMealType: destinationMealBoxRecord.data.mealType,
          destinationIndex: -1,
        });
        return;
      }
      if (destination === 2 && source.data.type === 'mealCard') {
        const destinationMealCardRecord = location.current.dropTargets[0];
        const destinationMealCardIndex = destinationMealCardRecord.data.index;
        const closestEdgeOfTarget = extractClosestEdge(
          destinationMealCardRecord.data,
        );
        const isSameMealDate =
          source.data.mealDate === destinationMealCardRecord.data.mealDate;
        const isSameMealType =
          source.data.mealType === destinationMealCardRecord.data.mealType;

        const destinationIndex = findDestinationIndex({
          isSameMealBox: isSameMealDate && isSameMealType,
          sourceMealCardIndex: source.data.index,
          destinationMealCardIndex,
          closestEdgeOfTarget,
        });
        handleDropLogic({
          sourceMealDate: isSameMealDate ? undefined : source.data.mealDate,
          sourceMealType:
            isSameMealDate && isSameMealType ? undefined : source.data.mealType,
          sourceIndex: source.data.index,
          destinationMealDate: destinationMealCardRecord.data.mealDate,
          destinationMealType: destinationMealCardRecord.data.mealType,
          destinationIndex: destinationIndex,
        });
        return;
      }
    },
    [handleDropLogic, findDestinationIndex],
  );

  useEffect(() => monitorForElements({ onDrop: handleDrop }), [handleDrop]);
};
