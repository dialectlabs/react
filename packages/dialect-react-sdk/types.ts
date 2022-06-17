import type { DialectSdkError, Message as SdkMessage } from '@dialectlabs/sdk';

export interface Message extends SdkMessage {
  id: string;
}

export interface LocalMessage extends Message {
  isSending?: boolean;
  error?: DialectSdkError | null;
}
