import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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
  setDraggingCardHeight,
  setIsDragging,
} from '@/redux/slices/pantry/pantrySlice';

export type PantryStatus = 'in_pantry' | 'need_buy';

interface UsePantryCardDragOptions {
  cardId: string;
  status: PantryStatus;
  index: number;
  onDrop?: (
    sourceData: Record<string, unknown>,
    targetStatus: PantryStatus,
  ) => void;
}

interface UsePantryCardDragReturn {
  pantryCardRef: React.RefObject<HTMLDivElement | null>;
  closestEdge: Edge | null;
  dragState: boolean;
}

export const usePantryCardDrag = ({
  cardId,
  status,
  index,
  onDrop,
}: UsePantryCardDragOptions): UsePantryCardDragReturn => {
  const [dragState, setDragState] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const pantryCardRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  // draggingCardHeight removed from here to avoid re-renders on every card
  // It will be consumed by a specific connected component instead.

  // refs to avoid unnecessary re-renders during drag
  const prevEdgeRef = useRef<Edge | null>(null);
  const prevDragStateRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const pendingAttrsRef = useRef<Record<string, string | null> | null>(null);

  useEffect(() => {
    const cardElement = pantryCardRef.current;
    invariant(cardElement, 'pantryCardElement is not defined');

    // mark element for CSS targeting
    cardElement.dataset.pantryCard = 'true';

    const setAttrsWithRef = (attrs: Record<string, string | null>) => {
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
              delete cardElement.dataset[key];
            } else {
              cardElement.dataset[key] = value;
            }
          }
        });
      }
    };

    const clearAllPantryCardAttrs = () => {
      document.querySelectorAll("[data-pantry-card='true']").forEach((el) => {
        delete (el as HTMLElement).dataset.draggingOver;
        delete (el as HTMLElement).dataset.closestEdge;
        (el as HTMLElement).style.transform = '';
      });
    };

    return combine(
      draggable({
        element: cardElement,
        getInitialData: () => ({
          type: 'pantry',
          id: cardId,
          status,
          index,
          height: cardElement.clientHeight,
        }),
        onDragStart: () => {
          const height = cardElement.clientHeight;
          dispatch(setDraggingCardHeight({ draggingCardHeight: height }));
          dispatch(setIsDragging({ isDragging: true }));
          cardElement.style.opacity = '0.4';
          cardElement.style.willChange = 'transform, opacity';
        },
        onDrop: () => {
          dispatch(setIsDragging({ isDragging: false }));
          cardElement.style.display = 'flex';
          cardElement.style.opacity = '1';
          cardElement.style.willChange = '';
          setAttrsWithRef({ draggingOver: null, closestEdge: null });
          clearAllPantryCardAttrs();
          prevEdgeRef.current = null;
          prevDragStateRef.current = false;
        },
      }),

      dropTargetForElements({
        element: cardElement,
        getData: ({ input, element }) => {
          const data = {
            type: 'pantry',
            id: cardId,
            status,
            index,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        getIsSticky: () => true,
        canDrop: ({ source }) => {
          // Accept pantry items, grocery items, and food cards
          if (source.data.type === 'grocery') return true;
          if (source.data.type === 'foodCardSideAdd') return true;
          if (source.data.type === 'pantry') {
            return source.data.id !== cardId;
          }
          return false;
        },
        onDragEnter: (args) => {
          if (args.source.data.id !== cardId) {
            const edge = extractClosestEdge(args.self.data);
            setAttrsWithRef({ draggingOver: 'true', closestEdge: edge ?? '' });
            cardElement.style.willChange = 'transform';

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
          if (args.source.data.id !== cardId) {
            const edge = extractClosestEdge(args.self.data);
            if (prevEdgeRef.current !== edge) {
              prevEdgeRef.current = edge;
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
          if (source.data.id === cardId) {
            cardElement.style.display = 'none';
            cardElement.style.opacity = '1';
          }
          cardElement.style.willChange = '';
          clearAllPantryCardAttrs();
        },
        onDrop: ({ source }) => {
          setAttrsWithRef({ draggingOver: null, closestEdge: null });
          prevEdgeRef.current = null;
          if (prevDragStateRef.current) {
            prevDragStateRef.current = false;
            setDragState(false);
          }
          setClosestEdge(null);
          if (source.data.id === cardId) {
            cardElement.style.opacity = '1';
          }
          cardElement.style.willChange = '';
          clearAllPantryCardAttrs();

          if (onDrop) {
            onDrop(source.data, status);
          }
        },
      }),
      () => {
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      },
    );
  }, [cardId, status, index, dispatch, onDrop]);

  return { pantryCardRef, closestEdge, dragState };
};
