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
