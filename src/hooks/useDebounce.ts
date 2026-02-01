import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';

export const useDebounce = <Args extends unknown[], Ret>(
  callback: (...args: Args) => Ret,
  delay: number,
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () => debounce((...args: Args) => callbackRef.current(...args), delay),
    [delay],
  );
};
