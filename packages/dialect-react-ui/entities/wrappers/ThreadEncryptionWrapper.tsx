import {
  AccountAddress,
  useDialectSdk,
  useThread,
} from '@dialectlabs/react-sdk';
import CantDecryptError from '../errors/ui/CantDecryptError';

// Only renders children if there's no decrypt error

interface ThreadEncyprionWrapperProps {
  children: JSX.Element;
  otherMemberAddress?: AccountAddress;
}

export default function ThreadEncyprionWrapper({
  children,
  otherMemberAddress,
}: ThreadEncyprionWrapperProps) {
  const { thread } = useThread({
    findParams: {
      otherMembers: otherMemberAddress ? [otherMemberAddress] : [],
    },
  });
  const {
    info: { supportsEndToEndEncryption },
  } = useDialectSdk();
  const cannotDecryptDialect =
    !supportsEndToEndEncryption && thread?.encryptionEnabled;

  if (cannotDecryptDialect) {
    return <CantDecryptError />;
  }

  return children;
}
