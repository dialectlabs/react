import { RefObject, useEffect } from 'react';

export function useOutsideAlerter(
  refs: RefObject<HTMLElement[]>,
  close: CallableFunction
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (!refs?.current) {
        return;
      }

      const clickWithinActiveElements = refs.current
        .filter(Boolean)
        .some((el) => el?.contains(event.target as Node));

      if (clickWithinActiveElements) {
        return;
      }

      // trigger close if click is outside desired elements
      close();
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, close]);
}
