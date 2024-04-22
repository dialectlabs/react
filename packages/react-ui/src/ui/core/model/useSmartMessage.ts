import {
  useDialectSdk,
  useNotificationThreadMessages,
} from '@dialectlabs/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useCallback, useState } from 'react';
import { smartMessageApi } from './api/smart-messages';

export interface UseSmartMessageValue {
  handleSmartMessageAction: (
    smartMessageId: string,
    actionHumanReadableId: string,
  ) => Promise<void>;
  handleSmartMessageCancel: (smartMessageId: string) => Promise<void>;
  isInitiatingSmartMessage: boolean;
  isCancellingSmartMessage: boolean;
}

export const useSmartMessage = (): UseSmartMessageValue => {
  const dialectSdk = useDialectSdk();
  const wallet = useWallet();
  const dialectCloudUrl = dialectSdk.config.dialectCloud.url;

  const { refreshMessages } = useNotificationThreadMessages();

  const [isInitiating, setIsInitiating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleAction = useCallback(
    async (smartMessageId: string, actionHumanReadableId: string) => {
      try {
        if (!wallet.signTransaction) {
          return;
        }

        setIsInitiating(true);

        const token = await dialectSdk.tokenProvider.get();
        const txResponse = await smartMessageApi.createSmartMessageTransaction(
          dialectCloudUrl,
          smartMessageId,
          token.rawValue,
          { actionHumanReadableId },
        );

        if (!txResponse) {
          return;
        }
        const versionedTransaction = VersionedTransaction.deserialize(
          Buffer.from(txResponse.transaction, 'base64'),
        );
        const signed = await wallet.signTransaction(versionedTransaction);
        await smartMessageApi.submitSmartMessageTransaction(
          dialectCloudUrl,
          smartMessageId,
          token.rawValue,
          {
            actionHumanReadableId,
            transaction: Buffer.from(signed.serialize()).toString('base64'),
          },
        );

        await refreshMessages();
      } finally {
        setIsInitiating(false);
      }
    },
    [dialectCloudUrl, dialectSdk.tokenProvider, wallet, refreshMessages],
  );

  const handleCancel = useCallback(
    async (smartMessageId: string) => {
      try {
        if (!wallet.signTransaction) {
          return;
        }

        setIsCancelling(true);

        await smartMessageApi.cancelSmartMessage(
          dialectCloudUrl,
          smartMessageId,
        );
      } finally {
        setIsCancelling(false);
      }
    },
    [dialectCloudUrl, wallet.signTransaction],
  );

  return {
    handleSmartMessageAction: handleAction,
    handleSmartMessageCancel: handleCancel,
    isInitiatingSmartMessage: isInitiating,
    isCancellingSmartMessage: isCancelling,
  };
};
