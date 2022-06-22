import {
  DialectCloudUnreachableError,
  DialectSdkError,
  DisconnectedFromChainError,
} from '@dialectlabs/sdk';
import { useEffect } from 'react';
import { DialectConnectionInfo } from '.';

const dialectCloudNetworkErrorMatcher = (err: DialectSdkError | null) =>
  err instanceof DialectCloudUnreachableError;

const solanaNetworkErrorMatcher = (err: DialectSdkError | null) =>
  err instanceof DisconnectedFromChainError;

// TODO: should use some kind of health checks
export const useDialectErrorsHandler = (
  ...errors: (DialectSdkError | null)[]
) => {
  const { _updateConnectionInfo: updateConnectionInfo } =
    DialectConnectionInfo.useContainer();

  useEffect(() => {
    if (errors.some(solanaNetworkErrorMatcher)) {
      updateConnectionInfo((prev) => {
        if (!prev.solana.connected) {
          return prev;
        }
        return { ...prev, solana: { ...prev.solana, connected: false } };
      });
    } else {
      updateConnectionInfo((prev) => {
        if (prev.solana.connected) {
          return prev;
        }
        return { ...prev, solana: { ...prev.solana, connected: true } };
      });
    }
    if (errors.some(dialectCloudNetworkErrorMatcher)) {
      updateConnectionInfo((prev) => {
        if (!prev.dialectCloud.connected) {
          return prev;
        }
        return {
          ...prev,
          dialectCloud: { ...prev.dialectCloud, connected: false },
        };
      });
    } else {
      updateConnectionInfo((prev) => {
        if (prev.dialectCloud.connected) {
          return prev;
        }
        return {
          ...prev,
          dialectCloud: { ...prev.dialectCloud, connected: true },
        };
      });
    }
  }, errors);
};
