import {
  useWallet,
  WalletProvider,
  MartianWalletAdapter,
  RiseWalletAdapter,
  WalletReadyState,
} from '@manahippo/aptos-wallet-adapter';
import React, { useEffect } from 'react';

const wallets = [new MartianWalletAdapter(), new RiseWalletAdapter()];

function shortenAddress(address: string, chars = 4): string {
  const addr = address.toString();
  return `${addr.substring(0, chars)}...${addr.substring(addr.length - chars)}`;
}

export const AptosWalletButton = () => {
  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.autoConnect && wallet?.wallet?.adapter) {
      wallet.connect();
    }
  }, [wallet]);

  const firstAvailableAdapter = wallet.wallets.find(
    (it) => it.readyState === WalletReadyState.Installed
  );

  return (
    <button
      className="border border-gray-500 text-white px-4 py-3 rounded-md"
      onClick={() => {
        if (!firstAvailableAdapter) return;
        wallet.select(firstAvailableAdapter.adapter.name);
      }}
    >
      {wallet.connected
        ? shortenAddress(wallet.account?.address?.toString() || '')
        : 'Connect Aptos wallet'}
    </button>
  );
};

export const AptosWalletContext: React.FC<any> = (props) => {
  return (
    <WalletProvider
      wallets={wallets}
      onError={(error: Error) => {
        console.log('Handle Error Message', error);
      }}
    >
      {props.children}
    </WalletProvider>
  );
};
