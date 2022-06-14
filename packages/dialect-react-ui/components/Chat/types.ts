export interface ChatNavigationHelpers {
  showMain: () => void;
  showThread: (threadId: string) => void;
  showCreateThread: (receiver?: string) => void;
  showThreadSettings: (threadId: string) => void;
}
