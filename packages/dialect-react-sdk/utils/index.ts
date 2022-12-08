import { DIALECT_API_TYPE_DIALECT_CLOUD } from '@dialectlabs/sdk';

export const EMPTY_OBJ = {};
export const EMPTY_ARR = [];
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = (): void => {};

export function isOnChain(type: string): boolean {
  return type !== DIALECT_API_TYPE_DIALECT_CLOUD;
}
export function isOffChain(type: string): boolean {
  return type === DIALECT_API_TYPE_DIALECT_CLOUD;
}

export function isBrowser() {
  return typeof window !== 'undefined';
}
