import {
  AddressType,
  ThreadMemberScope,
  useDialectContext,
  useDialectSdk,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
  useNotificationThread,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback } from 'react';
import { displayAddress } from '../../../../utils/displayAddress';
import { Button, IconButton, Input } from '../../../core';
import { ClassTokens, Icons } from '../../../theme';
import { ChannelNotificationsToggle } from './ChannelNotificationsToggle';

const ADDRESS_TYPE = AddressType.Wallet;

export const WalletChannel = () => {
  const { dappAddress } = useDialectContext();
  const {
    wallet: { address: walletAddress },
  } = useDialectSdk();

  const {
    thread,
    create: createThread,
    isCreatingThread,
    delete: deleteThread,
    isDeletingThread,
  } = useNotificationThread();

  const {
    globalAddress: walletSubscriptionAddress,
    create: createAddress,
    delete: deleteAddress,
    isCreatingAddress,
    isDeletingAddress,
  } = useNotificationChannel({ addressType: ADDRESS_TYPE });

  const {
    enabled: subscriptionEnabled,
    toggleSubscription,
    isToggling,
  } = useNotificationChannelDappSubscription({
    addressType: ADDRESS_TYPE,
    dappAddress,
  });

  const deleteWalletThread = useCallback(async () => {
    await deleteThread();
    await deleteAddress();
  }, [deleteAddress, deleteThread]);

  const createWalletThread = useCallback(async () => {
    if (!dappAddress) return;
    return createThread({
      me: { scopes: [ThreadMemberScope.ADMIN] },
      otherMembers: [
        { address: dappAddress, scopes: [ThreadMemberScope.WRITE] },
      ],
      encrypted: false,
    });
  }, [createThread, dappAddress]);

  const createWalletAddress = useCallback(
    () => createAddress({ value: walletAddress }),
    [createAddress, walletAddress],
  );

  const isLoading =
    isDeletingThread ||
    isCreatingThread ||
    isDeletingAddress ||
    isCreatingAddress ||
    isToggling;

  const setUpWallet = useCallback(async () => {
    if (isLoading) return;
    const noSubscription = !walletSubscriptionAddress && !thread;
    let notificationsThread;
    if (!thread) {
      notificationsThread = await createWalletThread();
    }
    let walletAddress;
    if (!walletSubscriptionAddress) {
      walletAddress = await createWalletAddress();
    }
    if (noSubscription && notificationsThread) {
      await toggleSubscription({ enabled: true, address: walletAddress });
    }
  }, [
    createWalletAddress,
    createWalletThread,
    isLoading,
    thread,
    toggleSubscription,
    walletSubscriptionAddress,
  ]);

  const isWalletSetUp = thread && walletSubscriptionAddress;
  const RightAdornment = useCallback(() => {
    if (isLoading)
      return (
        <div className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}>
          <Icons.Loader />
        </div>
      );
    if (isWalletSetUp)
      return (
        <IconButton
          className={'dt-p-2 ' + ClassTokens.Icon.Tertiary}
          onClick={deleteWalletThread}
          icon={<Icons.Trash />}
        />
      );
    return <Button onClick={setUpWallet}>Enable</Button>;
  }, [deleteWalletThread, isLoading, isWalletSetUp, setUpWallet]);

  return (
    <div className="dt-flex dt-flex-col dt-gap-2">
      <Input
        label="In App"
        disabled
        value={displayAddress(walletAddress)}
        rightAdornment={<RightAdornment />}
      />
      {isWalletSetUp && (
        <ChannelNotificationsToggle
          enabled={subscriptionEnabled}
          onChange={(newValue: boolean) => {
            if (isToggling) return;
            return toggleSubscription({ enabled: newValue });
          }}
        />
      )}
    </div>
  );
};
