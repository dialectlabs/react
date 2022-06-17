import {
  DialectCloudUnreachableError,
  DialectSdkError,
  DisconnectedFromChainError,
} from '@dialectlabs/sdk';
import { useEffect } from 'react';
import { useDialectContext } from '../../hooks';

const dialectCloudNetworkErrorMatcher = (err: DialectSdkError | null) =>
  err instanceof DialectCloudUnreachableError;

const solanaNetworkErrorMatcher = (err: DialectSdkError | null) =>
  err instanceof DisconnectedFromChainError;

export const useDialectErrorsHandler = (
  ...errors: (DialectSdkError | null)[]
) => {
  const { _updateConnectionInfo: updateConnectionInfo } = useDialectContext();

  useEffect(() => {
    if (errors.some(solanaNetworkErrorMatcher)) {
      updateConnectionInfo((prev) => {
        if (!prev.solana) {
          return prev;
        }
        return { ...prev, solana: false };
      });
    } else {
      updateConnectionInfo((prev) => {
        if (prev.solana) {
          return prev;
        }
        return { ...prev, solana: true };
      });
    }
    if (errors.some(dialectCloudNetworkErrorMatcher)) {
      updateConnectionInfo((prev) => {
        if (!prev.dialectCloud) {
          return prev;
        }
        return { ...prev, dialectCloud: false };
      });
    } else {
      updateConnectionInfo((prev) => {
        if (prev.dialectCloud) {
          return prev;
        }
        return { ...prev, dialectCloud: true };
      });
    }
  }, errors);
};
