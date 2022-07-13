import {
  useDialectDapp,
  useDialectSdk,
  useDialectWallet,
  useThread,
} from '@dialectlabs/react-sdk';
import CantDecryptError from '../../entities/errors/ui/CantDecryptError';
import EncryptionInfo from '../../entities/wallet-states/EncryptionInfo';
import SignMessageInfo from '../../entities/wallet-states/SignMessageInfo';

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

  const { isSigning, isEncrypting } = useDialectWallet();

  if (isSigning) {
    return <SignMessageInfo />;
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
