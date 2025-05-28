import {
  useDialectContext,
  useDialectSdk,
  useDialectWallet,
} from '@dialectlabs/react-sdk';
import React from 'react';

import AppLoadingState from './AppLoadingState';
import AppNotLoadedState from './AppNotLoadedState';
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

  const {
    clientKey,
    app: { id: appId, isLoading: isAppDataLoading },
  } = useDialectContext();

  if (!isWalletConnected || (!sdk && isConnectionInitiated)) {
    return (
      <>
        {header}
        <NoWalletState message={notConnectedMessage} />
      </>
    );
  }

  // 2 extra states to handle appId mapping
  // likely to be removed once fully migrated to appId
  if (isAppDataLoading) {
    return (
      <>
        {header}
        <AppLoadingState />
      </>
    );
  }

  if (!appId || !clientKey) {
    return (
      <>
        {header}
        <AppNotLoadedState />
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
