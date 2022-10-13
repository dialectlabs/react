import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  AptosConfigProps,
  DialectAptosSdk,
  DialectAptosWalletAdapter,
} from '@dialectlabs/react-sdk-blockchain-aptos';
import {
  DialectSolanaSdk,
  DialectSolanaWalletAdapter,
  SolanaConfigProps,
} from '@dialectlabs/react-sdk-blockchain-solana';
import {
  Inbox as DialectInbox,
  ChatNavigationHelpers,
  ConfigProps,
  defaultVariables,
  DialectNoBlockchainSdk,
  DialectThemeProvider,
  DialectUiManagementProvider,
  IncomingThemeVariables,
  useDialectUiId,
} from '@dialectlabs/react-ui';
import { useWallet as useAptosWallet } from '@manahippo/aptos-wallet-adapter';
import {
  useWallet as useSolanaWallet,
  useConnection as useSolanaConnection,
} from '@solana/wallet-adapter-react';
import { AptosWalletButton } from '../components/AptosWallet';
import { SolanaWalletButton } from '../components/SolanaWallet';
import {
  aptosWalletToDialectWallet,
  solanaWalletToDialectWallet,
} from '../utils/wallet';

import { CardinalTwitterIdentityResolver } from '@dialectlabs/identity-cardinal';
import { CivicIdentityResolver } from '@dialectlabs/identity-civic';
import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import { SNSIdentityResolver } from '@dialectlabs/identity-sns';

function AuthedHome() {
  const { navigation } = useDialectUiId<ChatNavigationHelpers>('dialect-inbox');

  return (
    <div className="dialect">
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <button
            className="btn-primary"
            onClick={() => {
              navigation?.showCreateThread('@saydialect');
            }}
          >
            Message @saydialect
          </button>
          <SolanaWalletButton />
          <AptosWalletButton />
        </div>
        <div className="w-full lg:max-w-[1048px] px-6 h-[calc(100vh-8rem)] mt-8 mx-auto">
          <DialectInbox
            dialectId="dialect-inbox"
            wrapperClassName="h-full overflow-hidden rounded-2xl shadow-2xl shadow-neutral-800 border border-neutral-600"
          />
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { connection: solanaConnection } = useSolanaConnection();
  const solanaWallet = useSolanaWallet();
  const aptosWallet = useAptosWallet();

  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] =
    useState<DialectSolanaWalletAdapter | null>(null);
  const [dialectAptosWalletAdapter, setDialectAptosWalletAdapter] =
    useState<DialectAptosWalletAdapter | null>(null);

  useEffect(() => {
    setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(solanaWallet));
  }, [solanaWallet]);

  useEffect(() => {
    if (!aptosWallet.wallet) return;
    setDialectAptosWalletAdapter(
      aptosWalletToDialectWallet(aptosWallet.wallet.adapter)
    );
  }, [aptosWallet]);

  const dialectConfig = useMemo(
    (): ConfigProps => ({
      environment: 'development',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      identity: {
        resolvers: [
          new DialectDappsIdentityResolver(),
          new SNSIdentityResolver(solanaConnection),
          new CardinalTwitterIdentityResolver(solanaConnection),
        ],
      },
    }),
    [solanaConnection]
  );
  const solanaConfig: SolanaConfigProps = useMemo(
    () => ({
      wallet: dialectSolanaWalletAdapter,
    }),
    [dialectSolanaWalletAdapter]
  );

  const aptosConfig: AptosConfigProps = useMemo(
    () => ({
      wallet: dialectAptosWalletAdapter,
    }),
    [dialectAptosWalletAdapter]
  );

  const DialectProviders: React.FC<{ children: React.ReactNode }> = useCallback(
    (props: { children: React.ReactNode }) => {
      if (dialectSolanaWalletAdapter) {
        return (
          <DialectSolanaSdk config={dialectConfig} solanaConfig={solanaConfig}>
            {props.children}
          </DialectSolanaSdk>
        );
      }
      if (dialectAptosWalletAdapter) {
        return (
          <DialectAptosSdk config={dialectConfig} aptosConfig={aptosConfig}>
            {props.children}
          </DialectAptosSdk>
        );
      }
      return <DialectNoBlockchainSdk>{props.children}</DialectNoBlockchainSdk>;
    },
    [
      aptosConfig,
      dialectAptosWalletAdapter,
      dialectConfig,
      dialectSolanaWalletAdapter,
      solanaConfig,
    ]
  );

  return (
    <DialectProviders>
      <DialectUiManagementProvider>
        <DialectThemeProvider theme="dark">
          <AuthedHome />
        </DialectThemeProvider>
      </DialectUiManagementProvider>
    </DialectProviders>
  );
}
