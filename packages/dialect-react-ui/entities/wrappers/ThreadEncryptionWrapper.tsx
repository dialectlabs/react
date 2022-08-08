import { useDialectSdk, useThread } from '@dialectlabs/react-sdk';
import CantDecryptError from '../errors/ui/CantDecryptError';
import type { PublicKey } from '@solana/web3.js';

// Only renders children if there's no decrypt error

interface ThreadEncyprionWrapperProps {
  children: JSX.Element;
  otherMemberPK?: PublicKey;
}

export default function ThreadEncyprionWrapper({
  children,
  otherMemberPK,
}: ThreadEncyprionWrapperProps) {
  const { thread } = useThread({
    findParams: { otherMembers: otherMemberPK ? [otherMemberPK] : [] },
  });
  const {
    info: { apiAvailability },
  } = useDialectSdk();
  const cannotDecryptDialect =
    !apiAvailability.canEncrypt && thread?.encryptionEnabled;

  if (cannotDecryptDialect) {
    return <CantDecryptError />;
  }

  return children;
}
