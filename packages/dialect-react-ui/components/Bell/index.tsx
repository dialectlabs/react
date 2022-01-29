import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { BellIcon } from '@heroicons/react/outline';
import NotificationCenter from '../NotificationCenter';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Wallet } from '@solana/wallet-adapter-wallets';
import {
  useWallet,
  ApiContextProvider,
  WalletContextProvider,
} from '@dialectlabs/web3';

type PropTypes = {
  wallet: AnchorWallet | Wallet | undefined;
  publicKey: anchor.web3.PublicKey;
};

function WrappedBell(props: PropTypes): JSX.Element {
  const [open, setOpen] = useState(false);
  const { onWebConnect, onWebDisconnect, webWallet } = useWallet();

  useEffect(() => {
    if (props.wallet) {
      onWebConnect(props.wallet);
    } else if (props.wallet === null || !props.wallet?.connected) {
      onWebDisconnect();
    }
  }, [onWebConnect, onWebDisconnect, props.wallet, props.wallet?.connected]);
  return (
    <div className="flex flex-col items-end">
      <button
        className="bg-th-bkg-4 flex items-center justify-center rounded-full w-8 h-8 text-th-fgd-1 focus:outline-none hover:text-th-primary"
        onClick={() => setOpen(!open)}
      >
        <BellIcon className="w-4 h-4 rounded-full" />
      </button>
      {open && (
        <div className="z-50 absolute top-14 w-96 h-96">
          <NotificationCenter {...props} />
        </div>
      )}
    </div>
  );
}

export function Bell(props: PropTypes): JSX.Element {
  return (
    <WalletContextProvider>
      <ApiContextProvider>
        <WrappedBell {...props} />
      </ApiContextProvider>
    </WalletContextProvider>
  );
}
