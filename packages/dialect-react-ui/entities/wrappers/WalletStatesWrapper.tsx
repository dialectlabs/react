import { useDialectWallet } from '@dialectlabs/react-sdk';
import NoWalletError from '../errors/ui/NoWalletError';
import EncryptionInfo from '../wallet-states/EncryptionInfo';
import SignMessageInfo from '../wallet-states/SignMessageInfo';
import SignTransactionInfo from '../wallet-states/SignTransactionInfo';

// Only renders children if wallet is connected, access token and encryption keys are created

interface WalletStatesWrapperProps {
  notConnectedMessage?: string | JSX.Element;
  header?: JSX.Element | null;
  children: JSX.Element;
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
    adapter: { connected: isWalletConnected },
  } = useDialectWallet();

  if (!isWalletConnected) {
    return (
      <>
        {header}
        <NoWalletError message={notConnectedMessage} />
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
