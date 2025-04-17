import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import invariant from 'tiny-invariant';

import {
  mealPlanSelector,
  setDraggingCardHeight,
} from '@/redux/slices/mealPlan';

export const useMealCardDrag = ({
  mealDate,
  mealType,
  cardId,
}: {
  mealDate: string;
  mealType: string;
  cardId: string;
}) => {
  const dispatch = useDispatch();
  const draggingCardHeight = useSelector(mealPlanSelector).draggingCardHeight;
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const mealCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mealCardElement = mealCardRef.current;
    invariant(mealCardElement, 'mealCardElement is not defined');

    return combine(
      draggable({
        element: mealCardElement,
        getInitialData: () => ({
          type: 'mealCard',
          mealDate,
          mealType,
          cardId,
        }),
        onDragStart: () => {
          setIsDragging(true);
          dispatch(
            setDraggingCardHeight({
              draggingCardHeight: mealCardElement.clientHeight,
            }),
          );
          // set current card display none
          mealCardElement.style.display = 'none';
        },
        onDrop: () => {
          setIsDragging(false);
          mealCardElement.style.display = '';
        },
      }),

      dropTargetForElements({
        element: mealCardElement,
        getData: ({ input, element }) => {
          const data = {
            type: 'mealCard',
            mealDate,
            mealType,
            cardId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          if (
            args.source.data.mealDate !== mealDate ||
            args.source.data.mealType !== mealType ||
            args.source.data.cardId !== cardId
          ) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (
            args.source.data.mealDate !== mealDate ||
            args.source.data.mealType !== mealType ||
            args.source.data.cardId !== cardId
          ) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      }),
    );
  }, [cardId, mealDate, mealType, dispatch]);

  return { mealCardRef, isDragging, closestEdge, draggingCardHeight };
};
