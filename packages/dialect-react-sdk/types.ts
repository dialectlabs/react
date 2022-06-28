import type {
  ConfigProps,
  DialectSdkError,
  ThreadMessage as SdkThreadMessage,
  DialectWalletAdapter as DialectSdkWalletAdapter,
} from '@dialectlabs/sdk';

export interface ThreadMessage extends SdkThreadMessage {
  id: string;
}

export interface LocalThreadMessage extends ThreadMessage {
  isSending?: boolean;
  error?: DialectSdkError | null;
}

export type Config = Omit<ConfigProps, 'wallet'>;

export interface DialectWalletAdapter extends DialectSdkWalletAdapter {
  connected: boolean;
}
