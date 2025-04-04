import { useEffect, useRef } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface UseMealBoxDropProps {
  mealDate: string;
  mealType: string;
  setIsHovered?: (isHovered: boolean) => void;
}

const useMealBoxDrop = ({
  mealDate,
  mealType,
  setIsHovered = () => {},
}: UseMealBoxDropProps) => {
  const mealBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mealBoxElement = mealBoxRef.current;
    if (!mealBoxElement) return;

    return dropTargetForElements({
      element: mealBoxElement,
      onDragStart: () => setIsHovered(true),
      onDragEnter: () => setIsHovered(true),
      onDragLeave: () => setIsHovered(false),
      onDrop: () => setIsHovered(false),
      getData: () => ({ mealDate, mealType }),
      getIsSticky: () => true,
    });
  }, [mealDate, mealType, setIsHovered]);

  return mealBoxRef;
};

export default useMealBoxDrop;
