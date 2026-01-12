import React from 'react';
import { useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';

import { cn } from '@/helpers/helpers';
import useRemoveDropzoneDrop from '@/hooks/useRemoveDropzoneDrop';
import { mealPlanSelector } from '@/redux/slices/mealPlan';

interface RemoveDropzoneProps {
  className?: string;
}

const RemoveDropzone: React.FC<RemoveDropzoneProps> = ({ className }) => {
  const { removeDropzoneRef, isDragEnter } = useRemoveDropzoneDrop();
  const isDragging = useSelector(mealPlanSelector).isDragging;

  return (
    <div
      ref={removeDropzoneRef}
      className={cn(
        'pointer-events-none flex h-[100px] w-[200px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-red-200 opacity-0',
        'bg-[repeating-linear-gradient(45deg,_rgba(255,255,255,0.3)_0px,_rgba(255,255,255,0.3)_10px,_transparent_10px,_transparent_20px)]',
        'relative bg-red-100 backdrop-blur-sm transition-all duration-200',
        isDragEnter &&
          'border-red-200 shadow-[0_0_12px_2px_rgba(220,116,139,0.6)]',
        isDragging && 'pointer-events-auto opacity-100',
        className,
      )}
    >
      <DeleteOutlined
        className={cn(
          'text-base text-red-400 transition-all duration-100',
          isDragEnter && 'text-red-500',
        )}
      />
      <span
        className={cn(
          'text-center text-[11px] font-semibold text-red-400 transition-all duration-100',
          isDragEnter && 'text-red-500',
        )}
      >
        Drag here to remove
      </span>
    </div>
  );
};

export default RemoveDropzone;
