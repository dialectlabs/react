import { Backend } from '@dialectlabs/sdk';
import { useEffect, useState } from 'react';
import { EMPTY_ARR } from '../../../utils';
import { createContainer } from '../../../utils/container';
import { DialectWallet } from '../Wallet';

interface DialectBackendConnectionInfo {
  connected: boolean;
  shouldConnect: boolean;
}

interface DialectConnectionInfo {
  wallet: DialectBackendConnectionInfo;
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
  const { adapter } = DialectWallet.useContainer();

  const [connectionInfo, setConnectionInfo] = useState<DialectConnectionInfo>(
    () => ({
      wallet: {
        connected: Boolean(adapter.publicKey),
        shouldConnect: true,
      },
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

  useEffect(
    function updateWalletConnectionInfo() {
      setConnectionInfo((prev) => {
        if (prev.wallet.connected && Boolean(adapter.publicKey)) {
          return prev;
        }
        if (!prev.wallet.connected && !adapter.publicKey) {
          return prev;
        }
        return {
          ...prev,
          wallet: {
            ...prev.wallet,
            connected: Boolean(adapter.publicKey),
          },
        };
      });
    },
    [adapter]
  );

  return {
    connected: connectionInfo,
    _updateConnectionInfo: setConnectionInfo,
  };
}

export const DialectConnectionInfo = createContainer(useDialectConnectionInfo);
