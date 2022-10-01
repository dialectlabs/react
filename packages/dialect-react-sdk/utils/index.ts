export const EMPTY_OBJ = {};
export const EMPTY_ARR = [];
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = (): void => {};

export function isOnChain(type: string): boolean {
  return type !== 'dialect-cloud';
}
export function isOffChain(type: string): boolean {
  return type === 'dialect-cloud';
}
