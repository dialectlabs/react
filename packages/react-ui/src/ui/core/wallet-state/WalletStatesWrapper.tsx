import { useDialectSdk, useDialectWallet } from '@dialectlabs/react-sdk';
import React from 'react';

import NoWalletState from './NoWalletState';
import NotAuthorizedState from './NotAuthorizedState';
import SigningMessageState from './SigningMessageState';
import SigningTransactionState from './SigningTransactionState';

// Only renders children if wallet is connected, access token and encryption keys are created

interface WalletStatesWrapperProps {
  notConnectedMessage?: string | JSX.Element;
  header?: JSX.Element | null;
  children: React.ReactNode;
}

function WalletStatesWrapper({
  header = null,
  notConnectedMessage,
  children,
}: WalletStatesWrapperProps) {
  const sdk = useDialectSdk(true);

  const {
    walletConnected: { get: isWalletConnected },
    connectionInitiatedState: { get: isConnectionInitiated },
    isSigningMessageState: { get: isSigningMessage },
    isSigningFreeTransactionState: { get: isSigningFreeTransaction },
  } = useDialectWallet();

  if (!isWalletConnected || (!sdk && isConnectionInitiated)) {
    return (
      <>
        {header}
        <NoWalletState message={notConnectedMessage} />
      </>
    );
  }

  if (!isConnectionInitiated) {
    return (
      <>
        {header}
        <NotAuthorizedState />
      </>
    );
  }

  if (isSigningMessage) {
    return (
      <>
        {header}
        <SigningMessageState />
      </>
    );
  }

  if (isSigningFreeTransaction) {
    return (
      <>
        {header}
        <SigningTransactionState />
      </>
    );
  }

  return children;
}

export default WalletStatesWrapper;
