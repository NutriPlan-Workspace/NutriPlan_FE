import { useEffect, useRef, useState } from 'react';
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

export const useMealCardDrag = ({
  mealDate,
  mealType,
  cardId,
}: {
  mealDate: string;
  mealType: string;
  cardId: string;
}) => {
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
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
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
  }, [cardId, mealDate, mealType]);

  return { mealCardRef, isDragging, closestEdge };
};
