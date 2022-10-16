import type { DialectSdkError, ThreadMessage } from '@dialectlabs/sdk';

export interface LocalThreadMessage extends ThreadMessage {
  deduplicationId: string;
  isSending?: boolean;
  error?: DialectSdkError | null;
}
