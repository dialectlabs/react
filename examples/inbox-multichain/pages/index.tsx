import React, { useCallback, useEffect, useState } from 'react';

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
  ChatNavigationHelpers,
  ConfigProps,
  DialectNoBlockchainSdk,
  DialectThemeProvider,
  DialectUiManagementProvider,
  Inbox as DialectInbox,
  useDialectUiId,
} from '@dialectlabs/react-ui';
import { useWallet as useAptosWallet } from '@manahippo/aptos-wallet-adapter';
import {
  useConnection as useSolanaConnection,
  useWallet as useSolanaWallet,
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

  const DialectProviders: React.FC<{ children: React.ReactNode }> = useCallback(
    (props: { children: React.ReactNode }) => {
      const dialectConfig: ConfigProps = {
        environment: 'production',
        dialectCloud: {
          tokenStore: 'local-storage',
        },
        identity: {
          resolvers: [
            new DialectDappsIdentityResolver(),
            new SNSIdentityResolver(solanaConnection),
            new CardinalTwitterIdentityResolver(solanaConnection),
            new CivicIdentityResolver(solanaConnection),
          ],
        },
      };

      if (dialectSolanaWalletAdapter) {
        const solanaConfig: SolanaConfigProps = {
          wallet: dialectSolanaWalletAdapter,
        };

        return (
          <DialectSolanaSdk config={dialectConfig} solanaConfig={solanaConfig}>
            {props.children}
          </DialectSolanaSdk>
        );
      }
      if (dialectAptosWalletAdapter) {
        const aptosConfig: AptosConfigProps = {
          wallet: dialectAptosWalletAdapter,
        };

        return (
          <DialectAptosSdk config={dialectConfig} aptosConfig={aptosConfig}>
            {props.children}
          </DialectAptosSdk>
        );
      }
      return <DialectNoBlockchainSdk>{props.children}</DialectNoBlockchainSdk>;
    },
    [solanaConnection, dialectAptosWalletAdapter, dialectSolanaWalletAdapter]
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
