import { useDialectWallet } from '@dialectlabs/react-sdk';
import NotAuthorizedError from '../errors/ui/NotAuthorizedError';
import NoWalletError from '../errors/ui/NoWalletError';
import EncryptionInfo from '../wallet-states/EncryptionInfo';
import SignMessageInfo from '../wallet-states/SignMessageInfo';
import SignTransactionInfo from '../wallet-states/SignTransactionInfo';

// Only renders children if wallet is connected, access token and encryption keys are created

interface WalletStatesValue {
  isWalletConnected: boolean;
  isSigningMessage: boolean;
  isEncrypting: boolean;
  isConnectionInitiated: boolean;
}

interface WalletStatesWrapperProps {
  notConnectedMessage?: string | JSX.Element;
  header?: JSX.Element | null;
  children: JSX.Element | ((obj: WalletStatesValue) => JSX.Element | null);
}

function WalletStatesWrapper({
  header = null,
  notConnectedMessage,
  children,
}: WalletStatesWrapperProps) {
  const {
    isSigningMessage,
    isSigningFreeTransaction,
    isEncrypting,
    connectionInitiated: isConnectionInitiated,
    adapter: { connected: isWalletConnected },
  } = useDialectWallet();

  if (typeof children === 'function') {
    return children({
      isWalletConnected,
      isSigningMessage,
      isEncrypting,
      isConnectionInitiated,
    });
  }

  if (!isWalletConnected) {
    return (
      <>
        {header}
        <NoWalletError message={notConnectedMessage} />
      </>
    );
  }

  if (!isConnectionInitiated) {
    return (
      <>
        {header}
        <NotAuthorizedError />
      </>
    );
  }

  if (isSigningMessage) {
    return (
      <>
        {header}
        <SignMessageInfo />
      </>
    );
  }

  if (isSigningFreeTransaction) {
    return (
      <>
        {header}
        <SignTransactionInfo />
      </>
    );
  }

  if (isEncrypting) {
    return (
      <>
        {header}
        <EncryptionInfo />
      </>
    );
  }

  return children;
}

export default WalletStatesWrapper;
