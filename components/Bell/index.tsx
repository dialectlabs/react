import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { BellIcon } from '@heroicons/react/outline';
import NotificationCenter from '../NotificationCenter';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { useWallet, ApiContextProvider, WalletContextProvider } from '@dialectlabs/web3';

type PropTypes = {
  wallet: AnchorWallet | undefined;
  publicKey: anchor.web3.PublicKey;
}

function WrappedBell(props: PropTypes): JSX.Element {
  const [open, setOpen] = useState(false);
  const { onWebConnect, onWebDisconnect, webWallet } = useWallet();
  useEffect(() => {
    if (props.wallet) {
      onWebConnect(props.wallet);
    } else {
      onWebDisconnect();
    }
  }, [props.wallet]);
  return (
    <div className='flex flex-col items-end'>
      <button
      className='flex items-center justify-center w-9 h-9 rounded-full bg-gray-200'
        onClick={() => setOpen(!open)}
      >
        <BellIcon
          className='w-5 h-5 text-gray-700 rounded-full' />
      </button>
      {open && (
        <div className='absolute top-14 w-96 h-96'>
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
