import { useCallback, useEffect, useState } from 'react';
import {
  useDialectCloudApi,
  useDialectSdk,
  useThreads,
  useDialectDapp,
  useThread,
} from '@dialectlabs/react-sdk';
import NotificationsThreadSettings from './ThreadSettings';
import CreateNotificationsThread from './CreateNotificationsThread';
import { ToggleSection } from '../../../common';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type Web3Props = {
  onThreadDelete?: () => void;
};

export function Web3(props: Web3Props) {
  const {
    info: { wallet },
  } = useDialectSdk();
  const { dappAddress } = useDialectDapp();
  const [isDeletingAddress, setDeletingAddress] = useState(false);
  const [isSavingAddress, setSavingAddress] = useState(false);
  const [isUpdatingAddress, setUpdatingAddress] = useState(false);

  const { isCreatingThread } = useThreads();
  const {
    thread,
    delete: deleteDialect,
    isFetchingThread,
    isDeletingThread,
  } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const {
    addresses: { wallet: walletObj },
    saveAddress,
    updateAddress,
    deleteAddress,
  } = useDialectCloudApi();

  const isWeb3Enabled =
    (walletObj?.enabled && Boolean(thread)) ||
    Boolean(thread) ||
    isCreatingThread ||
    isSavingAddress ||
    isDeletingThread ||
    isDeletingAddress;

  const deleteWeb3 = useCallback(async () => {
    // console.log('trying to delete', { walletObj, isDeletingAddress });
    if (!walletObj || isDeletingAddress) return;
    setDeletingAddress(true);
    try {
      await deleteAddress({
        type: 'wallet',
        addressId: walletObj?.addressId,
      });
    } catch (e) {
      noop();
    } finally {
      setDeletingAddress(false);
    }
  }, [deleteAddress, isDeletingAddress, walletObj]);

  const saveWeb3 = useCallback(async () => {
    // console.log('trying to save', { walletObj, isSavingAddress });
    if (walletObj || isSavingAddress) return;
    setSavingAddress(true);
    try {
      await saveAddress({
        type: 'wallet',
        value: wallet?.publicKey?.toBase58(),
        enabled: true,
      });
    } catch (e) {
      noop();
    } finally {
      setSavingAddress(false);
    }
  }, [saveAddress, isSavingAddress, walletObj, wallet]);

  const updateWeb3Enabled = useCallback(
    async (enabled: boolean) => {
      if (!walletObj) return;
      setUpdatingAddress(true);
      await updateAddress({
        ...walletObj,
        type: 'wallet',
        value: wallet?.publicKey?.toBase58(),
        enabled,
      })
        .catch(noop)
        .finally(() => setUpdatingAddress(false));
    },
    [updateAddress, walletObj, wallet]
  );

  // TODO: move to the Notifications/index.tsx component
  // TODO: Support for threads created before address registry launch
  // FIXME: refactor
  useEffect(() => {
    if (
      isFetchingThread ||
      isSavingAddress ||
      isDeletingAddress ||
      isCreatingThread ||
      isDeletingThread
    )
      return;

    // Sync state in case of errors
    if (thread && !walletObj) {
      // In case the wallet isn't in web2 db, but the actual thread was created
      // console.log('trying to save in useEffect');
      saveWeb3();
    } else if (!thread && walletObj) {
      // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created

      deleteWeb3();
    }
  }, [
    isFetchingThread,
    thread,
    walletObj,
    isSavingAddress,
    isDeletingAddress,
    isCreatingThread,
    isDeletingThread,
    saveWeb3,
    deleteWeb3,
  ]);

  let content = (
    <NotificationsThreadSettings
      onThreadDelete={() => {
        deleteDialect()
          .then(async () => {
            await deleteWeb3();
            // TODO: properly wait for the deletion
            props?.onThreadDelete?.();
          })
          .catch(noop);
      }}
      isDeletingAddress={isDeletingAddress}
      isSavingAddress={isSavingAddress}
      isUpdatingAddress={isUpdatingAddress}
    />
  );

  if (!isWeb3Enabled || isCreatingThread || isSavingAddress) {
    content = (
      <CreateNotificationsThread
        onThreadCreated={() => saveWeb3()}
        onThreadCreationFailed={() => updateWeb3Enabled(false)}
        isSavingAddress={isSavingAddress}
      />
    );
  }

  return (
    <ToggleSection
      className="dt-mb-6"
      title="💬  Wallet notifications"
      // FIXME: fix toggle closing after succesfuly created thread
      enabled={isWeb3Enabled}
      onChange={async (nextValue) => {
        await updateWeb3Enabled(nextValue);
      }}
    >
      {content}
    </ToggleSection>
  );
}
