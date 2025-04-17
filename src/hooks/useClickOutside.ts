import React, { useEffect } from 'react';

type Callback = () => void;

export const useClickOutside = (
  callback: Callback,
  deps: React.RefObject<HTMLElement | null>[],
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = deps.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node),
      );

      if (isOutside) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback, ...deps]);
};
