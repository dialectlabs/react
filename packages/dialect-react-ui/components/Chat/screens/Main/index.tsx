import React, { useState } from 'react';
import ThreadsList from './ThreadsList';
import { useApi, useDialect } from '@dialectlabs/react';
import ThreadPage from './pages/ThreadPage/';
import clsx from 'clsx';
import { useTheme } from '../../../common/ThemeProvider';
import CreateThread from './pages/CreateThreadPage/CreateThread';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-wallets';
import type { BaseSolletWalletAdapter } from '@solana/wallet-adapter-sollet/src/base';
import type SolWalletAdapter from '@project-serum/sol-wallet-adapter';

interface MainProps {
  inbox?: boolean;
}

const Main = ({ inbox }: MainProps) => {
  const { dialectAddress, dialects, setDialectAddress } = useDialect();
  const { wallet } = useApi();

  const { icons } = useTheme();

  const [newThreadOpen, setNewThreadOpen] = useState(false);

  return (
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
      <button
        onClick={async () => {
          const walletContextState = (wallet as WalletContextState)!;

          if (walletContextState.wallet?.name === WalletName.Sollet) {
            const adapter: BaseSolletWalletAdapter =
              walletContextState.adapter as unknown as BaseSolletWalletAdapter;
            console.log(adapter);
            const solWalletAdapter: SolWalletAdapter =
              adapter._wallet as unknown as SolWalletAdapter;
            const publicKey = wallet?.publicKey?.toBytes()!;
            const keys = await solWalletAdapter.diffieHellman(publicKey);
            console.log(keys);
          } else {
            alert(
              `DiffieHellman not supported in ${walletContextState.wallet?.name}`
            );
          }
          // const uint8Array = new Uint8Array([1, 2]);
          // const uint8Array1 = await wal.signMessage(uint8Array);
        }}
      >
        DiffieHellman
      </button>

      <div
        className={clsx(
          'dt-flex dt-flex-1 dt-flex-col dt-border-neutral-600 dt-overflow-hidden dt-w-full',
          {
            'md:dt-max-w-xs md:dt-border-r md:dt-flex': inbox,
            'dt-hidden': dialectAddress || newThreadOpen,
          }
        )}
      >
        <div className="dt-px-2 dt-pt-2 dt-pb-4 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-font-bold">
          Messages
          <div
            className="dt-cursor-pointer"
            onClick={() => {
              setNewThreadOpen(true);
            }}
          >
            <icons.compose />
          </div>
        </div>
        <ThreadsList
          chatThreads={dialects}
          onThreadClick={(dAddr) => {
            setDialectAddress(dAddr);
            setNewThreadOpen(false);
          }}
        />
      </div>
      {newThreadOpen ? (
        <CreateThread
          onCloseRequest={() => {
            setNewThreadOpen(false);
          }}
        />
      ) : (
        <ThreadPage
          inbox={inbox}
          onNewThreadClick={() => setNewThreadOpen(true)}
        />
      )}
    </div>
  );
};

export default Main;
