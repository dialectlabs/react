import {
  useThreads,
  useDialectDapp,
  useThread,
  useAddresses,
  AddressType,
} from '@dialectlabs/react-sdk';
import NotificationsThreadSettings from './ThreadSettings';
import CreateNotificationsThread from './CreateNotificationsThread';
import { ToggleSection } from '../../../common';

type Web3Props = {
  onThreadDeleted?: () => void;
};

export function Web3({ onThreadDeleted }: Web3Props) {
  const { dappAddress } = useDialectDapp();
  const {
    addresses: { WALLET: walletObj },
    toggle,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const { isCreatingThread } = useThreads();
  const { isDeletingThread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const isWeb3Enabled =
    walletObj?.enabled ||
    isCreatingThread ||
    isCreatingAddress ||
    isDeletingThread ||
    isDeletingAddress;

  let content = (
    <NotificationsThreadSettings onThreadDeleted={onThreadDeleted} />
  );

  if (!isWeb3Enabled || isCreatingThread || isCreatingAddress) {
    content = <CreateNotificationsThread />;
  }

  return (
    <ToggleSection
      className="dt-mb-6"
      title="💬  Wallet notifications"
      // FIXME: fix toggle closing after succesfuly created thread
      enabled={isWeb3Enabled}
      onChange={async (nextValue) => {
        await toggle(AddressType.Wallet, nextValue);
      }}
    >
      {content}
    </ToggleSection>
  );
}
