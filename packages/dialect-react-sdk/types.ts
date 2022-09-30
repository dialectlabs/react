import type { DialectSdkError, ThreadMessage } from '@dialectlabs/sdk';

export interface LocalThreadMessage extends ThreadMessage {
  isSending?: boolean;
  error?: DialectSdkError | null;
}
