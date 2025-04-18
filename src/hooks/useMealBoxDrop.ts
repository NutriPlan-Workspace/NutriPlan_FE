import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface UseMealBoxDropProps {
  mealDate: string;
  mealType: string;
}

const useMealBoxDrop = ({ mealDate, mealType }: UseMealBoxDropProps) => {
  const mealBoxRef = useRef<HTMLDivElement | null>(null);
  const [isDragEnter, setIsDragEnter] = useState(false);
  const [isOnlyItemDraggingOver, setIsOnlyItemDraggingOver] = useState(false);

  useEffect(() => {
    const mealBoxElement = mealBoxRef.current;
    if (!mealBoxElement) return;

    const cleanup = dropTargetForElements({
      element: mealBoxElement,
      onDragEnter: ({ source }) => {
        setIsDragEnter(true);
        if (
          source.data.mealDate === mealDate &&
          source.data.mealType === mealType
        ) {
          setIsOnlyItemDraggingOver(true);
        }
      },
      onDragLeave: ({ source }) => {
        setIsDragEnter(false);
        if (
          source.data.mealDate === mealDate &&
          source.data.mealType === mealType
        ) {
          setIsOnlyItemDraggingOver(false);
        }
      },
      onDrop: () => {
        setIsDragEnter(false);
        setIsOnlyItemDraggingOver(false);
      },
      getData: () => ({ type: 'mealBox', mealDate, mealType }),
      getIsSticky: () => true,
    });

    return cleanup;
  }, [mealDate, mealType]);

  return { mealBoxRef, isDragEnter, isOnlyItemDraggingOver };
};

export default useMealBoxDrop;
