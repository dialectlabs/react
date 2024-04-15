import { useState } from 'react';
import { useDialectSdk } from '@dialectlabs/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { smartMessageApi } from '../smart-messages-api/api';

export interface UseSmartMessageValue {
  handleSmartMessageAction: (
    smartMessageId: string,
    actionHumanReadableId: string
  ) => Promise<void>;
  // isExecutingSmartMessageAction: boolean;
  // smartMessageActionError: string | null;
}

export const useSmartMessage = (): UseSmartMessageValue => {
  const dialectSdk = useDialectSdk();
  const wallet = useWallet();
  const dialectCloudUrl = dialectSdk.config.dialectCloud.url;

  // const [isExecuting, setIsExecuting] = useState(false);
  // const [actionError, setActionError] = useState<string | null>(null);

  const handleAction = async (
    smartMessageId: string,
    actionHumanReadableId: string
  ) => {
    // setIsExecuting(true);
    // setActionError(null);
    try {
      if (!wallet.signTransaction) {
        // setActionError('Wallet does not support transaction signing');
        return;
      }

      const token = await dialectSdk.tokenProvider.get();
      const txResponse = await smartMessageApi.createSmartMessageTransaction(
        dialectCloudUrl,
        smartMessageId,
        token.rawValue,
        { actionHumanReadableId }
      );

      if (!txResponse) {
        // setActionError('Failed to create transaction');
        return;
      }
      const versionedTransaction = VersionedTransaction.deserialize(
        Buffer.from(txResponse.transaction, 'base64')
      );
      const signed = await wallet.signTransaction(versionedTransaction);
      await smartMessageApi.submitSmartMessageTransaction(
        dialectCloudUrl,
        smartMessageId,
        token.rawValue,
        {
          actionHumanReadableId,
          transaction: Buffer.from(signed.serialize()).toString('base64'),
        }
      );
    } catch (e) {
      // setActionError('Failed to handle action');
    } finally {
      // setIsExecuting(false);
    }
  };

  return {
    handleSmartMessageAction: handleAction,
    // isExecutingSmartMessageAction: isExecuting,
    // smartMessageActionError: actionError,
  };
};
