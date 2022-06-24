import { ThreadMemberScope } from '@dialectlabs/sdk';

export function isWritable(scopes: ThreadMemberScope[]) {
  return scopes.includes(ThreadMemberScope.WRITE);
}

export function isAdminable(scopes: ThreadMemberScope[]) {
  return scopes.includes(ThreadMemberScope.ADMIN);
}
