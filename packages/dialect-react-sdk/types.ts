import type {
  ConfigProps,
  DialectSdkError,
  Message as SdkMessage,
  DialectWalletAdapter as DialectSdkWalletAdapter,
} from '@dialectlabs/sdk';

export interface Message extends SdkMessage {
  id: string;
}

export interface LocalMessage extends Message {
  isSending?: boolean;
  error?: DialectSdkError | null;
}

export type Config = Omit<ConfigProps, 'wallet'>;

export interface DialectWalletAdapter extends DialectSdkWalletAdapter {
  connected: boolean;
}
