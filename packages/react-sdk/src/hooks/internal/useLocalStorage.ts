import { Dispatch, useCallback, useState } from 'react';

const isLocalStorageAvailable = typeof globalThis.localStorage !== 'undefined';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isLocalStorageAvailable) {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = globalThis.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }

      // Save initial value
      globalThis.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
      // Parse stored json or if none return initialValue
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue: Dispatch<T> = useCallback(
    (value) => {
      if (!isLocalStorageAvailable) {
        console.warn(
          `Tried setting localStorage key “${key}” even though environment is not a browser`
        );
      }
      try {
        // Save state
        setStoredValue(value);
        // Save to local storage
        if (isLocalStorageAvailable) {
          globalThis.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        // Handle the error case
        console.error(error);
      }
    },
    [key]
  );
  return [storedValue, setValue];
}
