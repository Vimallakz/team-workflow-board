import { useCallback, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = getLocalStorage<T>(key);
    return stored ?? initialValue;
  });

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (previous: T) => T)(prev) : next;
        setLocalStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, setStoredValue] as const;
};
