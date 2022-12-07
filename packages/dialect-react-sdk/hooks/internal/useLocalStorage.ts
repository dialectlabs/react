import { Dispatch, useCallback, useState } from 'react';
import { isBrowser } from '../../utils';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }

      // Save initial value
      localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
      // Parse stored json or if none return initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue: Dispatch<T> = useCallback(
    (value) => {
      if (!isBrowser) {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a browser`
        );
      }
      try {
        // Save state
        setStoredValue(value);
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        // Handle the error case
        console.log(error);
      }
    },
    [key]
  );
  return [storedValue, setValue];
}
