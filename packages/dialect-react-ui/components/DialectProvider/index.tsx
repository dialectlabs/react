import React, { useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import {
  connected,
  useApi,
  WalletType,
  ApiProvider,
  DialectProvider as DialectProviderInternal,
} from '@dialectlabs/react';
import {
  ThemeProvider,
  ThemeType,
  IncomingThemeVariables,
} from '../common/ThemeProvider';

type PropTypes = {
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  publicKey: anchor.web3.PublicKey;
  theme?: ThemeType;
  variables?: IncomingThemeVariables;
  bellClassName?: string;
  bellStyle?: object;
  children?: React.ReactNode;
};

function WalletManagment(props: PropTypes) {
  const { setWallet, setNetwork, setRpcUrl } = useApi();
  const isWalletConnected = connected(props.wallet);

  useEffect(
    () => setWallet(connected(props.wallet) ? props.wallet : null),
    [props.wallet, isWalletConnected, setWallet]
  );
  useEffect(
    () => setNetwork(props.network || null),
    [props.network, setNetwork]
  );
  useEffect(() => setRpcUrl(props.rpcUrl || null), [props.rpcUrl, setRpcUrl]);

  return <>{props.children}</>;
}

export default function DialectProvider({
  theme = 'dark',
  variables,
  children,
  ...props
}: PropTypes): JSX.Element {
  return (
    <ApiProvider>
      <DialectProviderInternal publicKey={props.publicKey}>
        <ThemeProvider theme={theme} variables={variables}>
          <WalletManagment {...props}>{children}</WalletManagment>
        </ThemeProvider>
      </DialectProviderInternal>
    </ApiProvider>
  );
}
