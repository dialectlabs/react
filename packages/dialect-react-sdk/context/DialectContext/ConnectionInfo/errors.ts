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

const processError = (
  updateConnectionInfo: (
    fn: (prevInfo: DialectConnectionInfo) => DialectConnectionInfo
  ) => void,
  key: 'solana' | 'dialectCloud',
  connected: boolean
) => {
  updateConnectionInfo((prev) => {
    if (prev[key].connected === connected) {
      return prev;
    }
    return { ...prev, [key]: { ...prev[key], connected } };
  });
};

// TODO: should use some kind of health checks
export const useDialectErrorsHandler = (
  ...errors: (DialectSdkError | null)[]
) => {
  const { _updateConnectionInfo: updateConnectionInfo } =
    DialectConnectionInfo.useContainer();

  useEffect(() => {
    if (errors.some(solanaNetworkErrorMatcher)) {
      processError(updateConnectionInfo, 'solana', false);
    } else {
      processError(updateConnectionInfo, 'solana', true);
    }
    if (errors.some(dialectCloudNetworkErrorMatcher)) {
      processError(updateConnectionInfo, 'dialectCloud', false);
    } else {
      processError(updateConnectionInfo, 'dialectCloud', true);
    }
  }, errors);
};
