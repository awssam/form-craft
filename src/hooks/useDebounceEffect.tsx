import React from 'react';

/**
 * This hook is used to execute an effect after a certain amount of time has passed
 *
 * @param callback The callback to debounce - Always wrap it in `React.useCallback` to avoid infinite loops
 * @param wait The wait time in milliseconds.
 */
const useDebounceEffect = (callback: () => void, wait: number) => {
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback();
    }, wait);
  }, [callback, wait]);

  return null;
};

export default useDebounceEffect;
