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

  // refs to avoid unnecessary re-renders during drag
  const prevEdgeRef = useRef<Edge | null>(null);
  const prevDragStateRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const pendingAttrsRef = useRef<Record<string, string | null> | null>(null);

  useEffect(() => {
    const mealCardElement = mealCardRef.current;
    invariant(mealCardElement, 'mealCardElement is not defined');

    // mark element for CSS targeting
    mealCardElement.dataset.mealCard = 'true';

    const setAttrsWithRef = (attrs: Record<string, string | null>) => {
      // merge pending attrs
      pendingAttrsRef.current = {
        ...(pendingAttrsRef.current ?? {}),
        ...attrs,
      };
      if (rafIdRef.current == null) {
        rafIdRef.current = requestAnimationFrame(() => {
          const pending = pendingAttrsRef.current ?? {};
          pendingAttrsRef.current = null;
          rafIdRef.current = null;
          for (const [key, value] of Object.entries(pending)) {
            if (value == null) {
              delete mealCardElement.dataset[key];
            } else {
              mealCardElement.dataset[key] = value;
            }
          }
        });
      }
    };

    // Clear data attributes from all meal-card elements to avoid leaving
    // residual [data-dragging-over] / [data-closest-edge] selectors active
    const clearAllMealCardAttrs = () => {
      document.querySelectorAll("[data-meal-card='true']").forEach((el) => {
        // remove the data attributes used for CSS animations
        delete (el as HTMLElement).dataset.draggingOver;
        delete (el as HTMLElement).dataset.closestEdge;
        // also clear any inline transform left behind
        (el as HTMLElement).style.transform = '';
      });
    };

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
          // fade while still in original area
          mealCardElement.style.opacity = '0.4';
          mealCardElement.style.willChange = 'transform, opacity';
        },
        onDrop: () => {
          dispatch(setIsDragging({ isDragging: false }));
          // cleanup inline styles & data attributes
          mealCardElement.style.display = 'flex';
          mealCardElement.style.opacity = '1';
          mealCardElement.style.willChange = '';
          // remove attributes on this element via the batching helper
          setAttrsWithRef({ draggingOver: null, closestEdge: null });
          // also clear attributes from any other meal cards that might still
          // have them (ensures no CSS selector keeps applying after drop)
          clearAllMealCardAttrs();
          prevEdgeRef.current = null;
          prevDragStateRef.current = false;
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
            const edge = extractClosestEdge(args.self.data);
            // update element data attributes for CSS-driven animation
            setAttrsWithRef({ draggingOver: 'true', closestEdge: edge ?? '' });
            mealCardElement.style.willChange = 'transform';

            // minimize React re-renders by only updating when changed
            if (!prevDragStateRef.current) {
              prevDragStateRef.current = true;
              setDragState(true);
            }
            if (prevEdgeRef.current !== edge) {
              prevEdgeRef.current = edge;
              setClosestEdge(edge);
            }
          }
        },
        onDrag: (args) => {
          if (
            args.source.data.mealDate !== mealDate ||
            args.source.data.mealType !== mealType ||
            args.source.data.cardId !== cardId
          ) {
            const edge = extractClosestEdge(args.self.data);
            if (prevEdgeRef.current !== edge) {
              prevEdgeRef.current = edge;
              // update data attribute for smoother animation without re-render
              setAttrsWithRef({ closestEdge: edge ?? '' });
              setClosestEdge(edge);
            }
          }
        },
        onDragLeave: ({ source }) => {
          setAttrsWithRef({ draggingOver: null, closestEdge: null });
          prevEdgeRef.current = null;
          if (prevDragStateRef.current) {
            prevDragStateRef.current = false;
            setDragState(false);
          }
          setClosestEdge(null);
          // If the leaving source is this card, hide it entirely to make room
          if (source.data.cardId === cardId) {
            mealCardElement.style.display = 'none';
            mealCardElement.style.opacity = '1';
          }
          mealCardElement.style.willChange = '';
          // ensure other meal cards are not left with hover attributes
          clearAllMealCardAttrs();
        },
        onDrop: ({ source }) => {
          setAttrsWithRef({ draggingOver: null, closestEdge: null });
          prevEdgeRef.current = null;
          if (prevDragStateRef.current) {
            prevDragStateRef.current = false;
            setDragState(false);
          }
          setClosestEdge(null);
          if (source.data.cardId === cardId) {
            mealCardElement.style.opacity = '1';
          }
          mealCardElement.style.willChange = '';
          // clear any stray attrs left on other meal cards
          clearAllMealCardAttrs();
        },
      }),
      () => {
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      },
    );
  }, [cardId, mealDate, mealType, dispatch, index, draggingCardHeight]);

  return { mealCardRef, closestEdge, draggingCardHeight, dragState };
};
