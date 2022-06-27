import { Backend } from '@dialectlabs/sdk';
import { useState } from 'react';
import { EMPTY_ARR } from '../../../utils';
import { createContainer } from '../../../utils/container';

interface DialectBackendConnectionInfo {
  connected: boolean;
  shouldConnect: boolean;
}

export interface DialectConnectionInfo {
  solana: DialectBackendConnectionInfo;
  dialectCloud: DialectBackendConnectionInfo;
}

export interface DialectConnectionInfoState {
  connected: DialectConnectionInfo;

  _updateConnectionInfo(
    fn: (prevInfo: DialectConnectionInfo) => DialectConnectionInfo
  ): void;
}

function useDialectConnectionInfo(
  backends: Backend[] = EMPTY_ARR
): DialectConnectionInfoState {
  const [connectionInfo, setConnectionInfo] = useState<DialectConnectionInfo>(
    () => ({
      solana: {
        connected: Boolean(backends.includes(Backend.Solana)),
        shouldConnect: Boolean(backends.includes(Backend.Solana)),
      },
      dialectCloud: {
        connected: Boolean(backends.includes(Backend.DialectCloud)),
        shouldConnect: Boolean(backends.includes(Backend.DialectCloud)),
      },
    })
  );

  return {
    connected: connectionInfo,
    _updateConnectionInfo: setConnectionInfo,
  };
}

export const DialectConnectionInfo = createContainer(useDialectConnectionInfo);
