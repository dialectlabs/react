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
  // TODO: fix sdk call when wallet is not available
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

  const isDialectAvailable = Boolean(thread);
  const isWalletEnabled =
    (walletObj ? walletObj?.enabled : isDialectAvailable) ||
    isSavingAddress ||
    isDeletingAddress ||
    isCreatingThread ||
    isDeletingThread;

  const deleteWeb3 = useCallback(async () => {
    // console.log('trying to delete', walletObj);
    if (!walletObj) return;
    setDeletingAddress(true);
    await deleteAddress({
      type: 'wallet',
      addressId: walletObj?.addressId,
    })
      .catch(noop)
      .finally(() => setDeletingAddress(false));
  }, [deleteAddress, walletObj]);

  const saveWeb3 = useCallback(async () => {
    if (walletObj) return;
    setSavingAddress(true);
    await saveAddress({
      type: 'wallet',
      value: wallet?.publicKey?.toBase58(),
      enabled: true,
    })
      .catch(noop)
      .finally(() => setSavingAddress(false));
  }, [saveAddress, walletObj, wallet]);

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
      isCreatingThread ||
      isDeletingThread ||
      isSavingAddress ||
      isDeletingAddress ||
      isFetchingThread ||
      (isDialectAvailable && walletObj)
    )
      return;

    // // Sync state in case of errors
    // if (isDialectAvailable && !walletObj) {
    //   // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created
    //   saveWeb3();
    // } else if (!isDialectAvailable && walletObj) {
    //   // In case the wallet isn't in web2 db, but the actual thread was created
    //   deleteWeb3();
    // }
  }, [
    isDialectAvailable,
    isFetchingThread,
    isCreatingThread,
    isDeletingThread,
    wallet,
    deleteWeb3,
    saveWeb3,
    walletObj,
    walletObj?.addressId,
    isSavingAddress,
    isDeletingAddress,
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
          .catch(() => {});
      }}
    />
  );

  if (!isWalletEnabled || isCreatingThread || isSavingAddress) {
    content = (
      <CreateNotificationsThread
        onThreadCreated={() => saveWeb3()}
        onThreadCreationFailed={() => updateWeb3Enabled(false)}
      />
    );
  }

  return (
    <ToggleSection
      className="dt-mb-6"
      title="💬  Wallet notifications"
      // FIXME: fix toggle closing after succesfuly created thread
      enabled={isWalletEnabled}
      onChange={async (nextValue) => {
        await updateWeb3Enabled(nextValue);
      }}
    >
      {content}
    </ToggleSection>
  );
}
