import type {
  DialectSdkError,
  DialectWalletAdapter as DialectSdkWalletAdapter,
  ThreadMessage,
} from '@dialectlabs/sdk';

export interface LocalThreadMessage extends ThreadMessage {
  isSending?: boolean;
  error?: DialectSdkError | null;
}

export interface DialectWalletAdapter extends DialectSdkWalletAdapter {
  connected: boolean;
}
