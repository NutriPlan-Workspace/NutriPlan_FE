import { useCallback, useState } from 'react';

export function useStateWithChecking<T>(
  initialValue: T,
  callback: (value: T) => void,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue);

  const setStateWithCallback = useCallback(
    (value: T) => {
      setState(value);
      callback(value);
    },
    [callback],
  );

  return [state, setStateWithCallback];
}
