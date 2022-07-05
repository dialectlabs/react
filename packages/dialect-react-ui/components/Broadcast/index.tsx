import {
  useDialectWallet,
  useDialectConnectionInfo,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import NoConnectionError from '../../entities/errors/ui/NoConnectionError';
import NoWalletError from '../../entities/errors/ui/NoWalletError';
import EncryptionInfo from '../../entities/wallet-states/EncryptionInfo';
import SignMessageInfo from '../../entities/wallet-states/SignMessageInfo';
import { useTheme } from '../common/providers/DialectThemeProvider';
import BroadcastForm from './BroadcastForm';

function InnerBroadcast() {
  const {
    connected: {
      solana: {
        connected: isSolanaConnected,
        shouldConnect: isSolanaShouldConnect,
      },
      dialectCloud: {
        connected: isDialectCloudConnected,
        shouldConnect: isDialectCloudShouldConnect,
      },
    },
  } = useDialectConnectionInfo();

  const {
    isSigning,
    isEncrypting,
    connected: isWalletConnected,
  } = useDialectWallet();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  if (!isWalletConnected) {
    return <NoWalletError />;
  }

  if (!someBackendConnected) {
    return <NoConnectionError />;
  }

  if (isSigning) {
    return <SignMessageInfo />;
  }

  if (isEncrypting) {
    return <EncryptionInfo />;
  }

  return <BroadcastForm />;
}

const Wrapper = (props) => {
  const { textStyles, colors } = useTheme();
  return (
    <div
      className={clsx(
        textStyles.body,
        colors.primary,
        colors.bg,
        'dt-h-full dt-min-h-[515px] dt-p-4'
      )}
      {...props}
    />
  );
};

function Broadcast() {
  return (
    <Wrapper>
      <InnerBroadcast />
    </Wrapper>
  );
}

export default Broadcast;
