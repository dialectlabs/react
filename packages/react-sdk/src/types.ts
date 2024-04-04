import { DialectSdkError, ThreadMessage } from '@dialectlabs/sdk';

export type ChannelType = 'wallet' | 'email' | 'telegram';

export interface LocalThreadMessage extends ThreadMessage {
  deduplicationId: string;
  isSending?: boolean;
  error?: DialectSdkError | null;
}
