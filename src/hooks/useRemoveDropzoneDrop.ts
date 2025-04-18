import { useEffect, useRef, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const useRemoveDropzoneDrop = () => {
  const removeDropzoneRef = useRef<HTMLDivElement | null>(null);
  const [isDragEnter, setIsDragEnter] = useState(false);
  const [isDragStart, setIsDragStart] = useState(false);

  useEffect(() => {
    const removeDropzoneElement = removeDropzoneRef.current;
    if (!removeDropzoneElement) return;

    const cleanup = dropTargetForElements({
      element: removeDropzoneElement,
      onDragEnter: () => {
        setIsDragEnter(true);
      },
      onDragLeave: () => {
        setIsDragEnter(false);
      },
      onDrop: () => {
        setIsDragEnter(false);
      },
      getData: () => ({ type: 'removeDropzone' }),
      getIsSticky: () => false,
    });

    return cleanup;
  }, [removeDropzoneRef, setIsDragEnter, setIsDragStart]);

  return { removeDropzoneRef, isDragEnter, isDragStart };
};

export default useRemoveDropzoneDrop;
