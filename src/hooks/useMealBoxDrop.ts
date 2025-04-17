import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface UseMealBoxDropProps {
  mealDate: string;
  mealType: string;
  setIsHovered: (isHovered: boolean) => void;
}

const useMealBoxDrop = ({
  mealDate,
  mealType,
  setIsHovered,
}: UseMealBoxDropProps) => {
  const mealBoxRef = useRef<HTMLDivElement | null>(null);
  const [isDragEnter, setIsDragEnter] = useState(false);

  useEffect(() => {
    const mealBoxElement = mealBoxRef.current;
    if (!mealBoxElement) return;

    const cleanup = dropTargetForElements({
      element: mealBoxElement,
      onDragStart: () => setIsHovered(true),
      onDragEnter: () => {
        setIsHovered(true);
        setIsDragEnter(true);
      },
      onDragLeave: () => {
        setIsHovered(false);
        setIsDragEnter(false);
      },
      onDrop: () => {
        setIsHovered(false);
        setIsDragEnter(false);
      },
      getData: () => ({ mealDate, mealType }),
      getIsSticky: () => false,
    });

    return cleanup;
  }, [mealDate, mealType, setIsHovered]);

  return { mealBoxRef, isDragEnter };
};

export default useMealBoxDrop;
