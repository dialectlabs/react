import {
  useDialectDapp,
  useDialectSdk,
  useDialectWallet,
  useThread,
} from '@dialectlabs/react-sdk';
import CantDecryptError from '../../entities/errors/ui/CantDecryptError';
import EncryptionInfo from '../../entities/wallet-states/EncryptionInfo';
import SignMessageInfo from '../../entities/wallet-states/SignMessageInfo';
import SignTransactionInfo from '../../entities/wallet-states/SignTransactionInfo';

interface WalletStatesWrapperProps {
  children: JSX.Element;
}

function WalletStatesWrapper({ children }: WalletStatesWrapperProps) {
  const { dappAddress } = useDialectDapp();
  const { thread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });
  const {
    info: { apiAvailability },
  } = useDialectSdk();

  const cannotDecryptDialect =
    !apiAvailability.canEncrypt && thread?.encryptionEnabled;

  const { isSigningMessage, isSigningFreeTransaction, isEncrypting } =
    useDialectWallet();

  if (isSigningMessage) {
    return <SignMessageInfo />;
  }

  if (isSigningFreeTransaction) {
    return <SignTransactionInfo />;
  }

  if (isEncrypting) {
    return <EncryptionInfo />;
  }

  if (cannotDecryptDialect) {
    return <CantDecryptError />;
  }

  return children;
}

export default WalletStatesWrapper;
