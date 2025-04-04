import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';

import { mealPlanSelector } from '@/redux/slices/mealPlan';
import { MealItems, MealPlanFood } from '@/types/mealPlan';
import { isSameDay } from '@/utils/dateUtils';

import { useDragDropLogic } from './useDragDropLogic';

export const useMealTrackDragDrop = () => {
  const { moveMealCard, reorderMealCard } = useDragDropLogic();
  const userMealPlan = useSelector(mealPlanSelector).viewingMealPlans;

  const handleDropToMealBox = useCallback(
    (
      sourceMealBoxItems: MealPlanFood[] | undefined,
      draggedMealCardIndex: number | undefined,
      sourceMealDate: string,
      sourceMealType: keyof MealItems,
      destinationMealDate: string,
      destinationMealType: keyof MealItems,
    ) => {
      if (
        sourceMealType === destinationMealType &&
        sourceMealDate === destinationMealDate
      ) {
        const destinationIndex = getReorderDestinationIndex({
          startIndex: draggedMealCardIndex ?? 0,
          indexOfTarget: sourceMealBoxItems ? sourceMealBoxItems.length - 1 : 0,
          closestEdgeOfTarget: null,
          axis: 'vertical',
        });
        reorderMealCard({
          mealDate: sourceMealDate,
          mealType: sourceMealType,
          startIndex: draggedMealCardIndex ?? 0,
          finishIndex: destinationIndex,
        });
        return;
      }

      moveMealCard({
        movedMealCardIndexInSourceMealBox: draggedMealCardIndex ?? 0,
        sourceMealDate: sourceMealDate,
        sourceMealType: sourceMealType,
        movedMealCardIndexInDestinationMealBox: 0,
        destinationMealDate: destinationMealDate,
        destinationMealType: destinationMealType,
      });
    },
    [moveMealCard, reorderMealCard],
  );

  const handleDropToMealCard = useCallback(
    (
      draggedMealCardIndex: number | undefined,
      sourceMealDate: string,
      sourceMealType: keyof MealItems,
      destinationMealDate: string,
      destinationMealType: keyof MealItems,
      destinationMealCardIndex: number | undefined,
      closestEdgeOfTarget: Edge | null,
    ) => {
      if (
        sourceMealType === destinationMealType &&
        sourceMealDate === destinationMealDate
      ) {
        const destinationIndex = getReorderDestinationIndex({
          startIndex: draggedMealCardIndex ?? 0,
          indexOfTarget: destinationMealCardIndex ?? 0,
          closestEdgeOfTarget,
          axis: 'vertical',
        });
        reorderMealCard({
          mealDate: sourceMealDate,
          mealType: sourceMealType,
          startIndex: draggedMealCardIndex ?? 0,
          finishIndex: destinationIndex,
        });
        return;
      }

      const destinationIndex =
        closestEdgeOfTarget === 'top'
          ? (destinationMealCardIndex ?? 0)
          : (destinationMealCardIndex ?? 0) + 1;
      moveMealCard({
        movedMealCardIndexInSourceMealBox: draggedMealCardIndex ?? 0,
        sourceMealDate: sourceMealDate,
        sourceMealType: sourceMealType,
        movedMealCardIndexInDestinationMealBox: destinationIndex,
        destinationMealDate: destinationMealDate,
        destinationMealType: destinationMealType,
      });
    },
    [moveMealCard, reorderMealCard],
  );

  const handleDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ source, location }: { source: any; location: any }) => {
      const destination = location.current.dropTargets.length;
      if (!destination && source.data.type !== 'mealCard') return;

      const draggedMealCardId = source.data.cardId;
      const sourceMealCardRecord = location.initial.dropTargets[0];
      const sourceMealDate = sourceMealCardRecord.data.mealDate;
      const sourceMealType = sourceMealCardRecord.data.mealType;
      const sourceMealBoxItems = userMealPlan.find((mealPlan) =>
        isSameDay(new Date(mealPlan.mealDate), new Date(sourceMealDate)),
      )?.mealPlanDay?.mealItems[sourceMealType as keyof MealItems];
      const draggedMealCardIndex = sourceMealBoxItems?.findIndex(
        (mealItem) => mealItem._id === draggedMealCardId,
      );

      /* MealBox and MealCard is also a drop target
       * 1. MealBox so destination is 1
       * 2. MealCard (inside MealBox) so destination is 2
       */
      if (destination === 1) {
        const [destinationMealBoxRecord] = location.current.dropTargets;
        handleDropToMealBox(
          sourceMealBoxItems,
          draggedMealCardIndex,
          sourceMealDate,
          sourceMealType,
          destinationMealBoxRecord.data.mealDate,
          destinationMealBoxRecord.data.mealType,
        );
        return;
      }

      if (destination === 2) {
        const destinationMealCardRecord = location.current.dropTargets[0];
        const destinationMealBoxItems = userMealPlan.find((mealPlan) =>
          isSameDay(
            new Date(mealPlan.mealDate),
            new Date(destinationMealCardRecord.data.mealDate),
          ),
        )?.mealPlanDay?.mealItems[
          destinationMealCardRecord.data.mealType as keyof MealItems
        ];
        const destinationMealCardIndex = destinationMealBoxItems?.findIndex(
          (mealItem) => mealItem._id === destinationMealCardRecord.data.cardId,
        );
        const closestEdgeOfTarget = extractClosestEdge(
          destinationMealCardRecord.data,
        );

        handleDropToMealCard(
          draggedMealCardIndex,
          sourceMealDate,
          sourceMealType,
          destinationMealCardRecord.data.mealDate,
          destinationMealCardRecord.data.mealType,
          destinationMealCardIndex,
          closestEdgeOfTarget,
        );
        return;
      }
    },
    [userMealPlan, handleDropToMealBox, handleDropToMealCard],
  );

  useEffect(() => monitorForElements({ onDrop: handleDrop }), [handleDrop]);
};
