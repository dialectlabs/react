import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { BellIcon } from '@heroicons/react/outline';
import NotificationCenter from '../NotificationCenter';
import { ApiContextProvider, connected, useApi, WalletType } from '../../api/ApiContext';

type PropTypes = {
  wallet: WalletType;
  publicKey: anchor.web3.PublicKey;
};

function WrappedBell(props: PropTypes): JSX.Element {
  const [open, setOpen] = useState(false);
  const { setWallet } = useApi();

  useEffect(() => setWallet(props.wallet), [connected(props.wallet)]);

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
    <ApiContextProvider>
        <WrappedBell {...props} />
    </ApiContextProvider>
  );
}
