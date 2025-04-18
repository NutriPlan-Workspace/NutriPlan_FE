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
  setIsDragging,
} from '@/redux/slices/mealPlan';

export const useMealCardDrag = ({
  mealDate,
  mealType,
  cardId,
  index,
}: {
  mealDate: string;
  mealType: string;
  cardId: string;
  index: number;
}) => {
  const [dragState, setDragState] = useState(false);
  const dispatch = useDispatch();
  const draggingCardHeight = useSelector(mealPlanSelector).draggingCardHeight;
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
          index,
          height: mealCardElement.clientHeight,
        }),
        onDragStart: () => {
          const height = mealCardElement.clientHeight;
          dispatch(setDraggingCardHeight({ draggingCardHeight: height }));
          dispatch(setIsDragging({ isDragging: true }));
          mealCardElement.style.opacity = '0.4';
        },
        onDrop: () => {
          mealCardElement.style.display = 'flex';
          dispatch(setIsDragging({ isDragging: false }));
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
            index,
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
            setDragState(true);
            const edge = extractClosestEdge(args.self.data);
            setClosestEdge(edge);
          }
        },
        onDrag: (args) => {
          if (
            args.source.data.mealDate !== mealDate ||
            args.source.data.mealType !== mealType ||
            args.source.data.cardId !== cardId
          ) {
            const edge = extractClosestEdge(args.self.data);
            setClosestEdge(edge);
          }
        },
        onDragLeave: ({ source }) => {
          setDragState(false);
          setClosestEdge(null);
          if (source.data.cardId === cardId) {
            mealCardElement.style.display = 'none';
            mealCardElement.style.opacity = '1';
          }
        },
        onDrop: ({ source }) => {
          setDragState(false);
          setClosestEdge(null);
          if (source.data.cardId === cardId) {
            mealCardElement.style.opacity = '1';
          }
        },
      }),
    );
  }, [cardId, mealDate, mealType, dispatch, index]);

  return { mealCardRef, closestEdge, draggingCardHeight, dragState };
};
