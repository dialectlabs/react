import { MainRouteName, RouteName, ThreadRouteName } from './constants';
import type { RouterContextValue } from '../common/providers/Router';

type NavigateFn = RouterContextValue['navigate'] | undefined;

export function showThread(navigate: NavigateFn, threadId: string) {
  return navigate?.(RouteName.Main, {
    sub: {
      name: MainRouteName.Thread,
      params: { threadId },
      sub: { name: ThreadRouteName.Messages },
    },
  });
}

export function showMain(navigate: NavigateFn) {
  return navigate?.(RouteName.Main);
}

export function showCreateThread(navigate: NavigateFn, receiver?: string) {
  return navigate?.(RouteName.Main, {
    sub: {
      name: MainRouteName.CreateThread,
      params: { receiver },
    },
  });
}

export function showThreadSettings(navigate: NavigateFn, threadId: string) {
  return navigate?.(RouteName.Main, {
    sub: {
      name: MainRouteName.Thread,
      params: { threadId },
      sub: { name: ThreadRouteName.Settings },
    },
  });
}
