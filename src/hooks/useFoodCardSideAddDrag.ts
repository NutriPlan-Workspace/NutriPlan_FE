import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';

import { setDraggingCardHeight } from '@/redux/slices/mealPlan';
import type { Food } from '@/types/food';

export const useFoodCardSideAddDrag = ({ food }: { food: Food }) => {
  const dispatch = useDispatch();
  const foodCardSideAddRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const foodCardSideAddElement = foodCardSideAddRef.current;
    invariant(foodCardSideAddElement, 'foodCardSideAddElement is not defined');

    return draggable({
      element: foodCardSideAddElement,
      getInitialData: () => ({
        type: 'foodCardSideAdd',
        food,
      }),
      onDragStart: () => {
        setIsDragging(true);
        dispatch(
          setDraggingCardHeight({
            draggingCardHeight: foodCardSideAddElement.clientHeight,
          }),
        );
      },
      onDrop: () => {
        setIsDragging(false);
      },
    });
  }, [food, dispatch]);

  return {
    isDragging,
    foodCardSideAddRef: foodCardSideAddRef,
  };
};
