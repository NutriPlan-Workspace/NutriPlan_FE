import { useEffect, useRef } from 'react';

export function debounceValue<T>(
  value: T,
  delay: number,
  callback: (debouncedValue: T) => void,
) {
  let timer: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

export function useDebounceValue<T>(
  value: T,
  delay: number,
  callback: (debouncedValue: T) => void,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValueRef = useRef<T>(value);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const isEqual =
        JSON.stringify(previousValueRef.current) === JSON.stringify(value);

      if (!isEqual) {
        callback(value);
        previousValueRef.current = value;
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay, callback]);
}
