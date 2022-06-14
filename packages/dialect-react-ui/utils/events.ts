import type { MouseEvent } from 'react';

export const noPropagateEvent =
  <T extends (...args: any[]) => any>(fn?: T) =>
  (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    fn?.(e);
  };
