import { useDialectSdk } from '@dialectlabs/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useState } from 'react';
import { smartMessageApi } from './api/smart-messages';

export interface UseSmartMessageValue {
  handleSmartMessageAction: (
    smartMessageId: string,
    actionHumanReadableId: string,
  ) => Promise<void>;
  isInitiatingSmartMessage: boolean;
}

export const useSmartMessage = (): UseSmartMessageValue => {
  const dialectSdk = useDialectSdk();
  const wallet = useWallet();
  const dialectCloudUrl = dialectSdk.config.dialectCloud.url;

  const [isInitiating, setIsInitiating] = useState(false);

  const handleAction = async (
    smartMessageId: string,
    actionHumanReadableId: string,
  ) => {
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
    } finally {
      setIsInitiating(false);
    }
  };

  return {
    handleSmartMessageAction: handleAction,
    isInitiatingSmartMessage: isInitiating,
  };
};
