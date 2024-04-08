import {
  AddressType,
  ThreadMemberScope,
  useDialectSdk,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback } from 'react';
import { displayAddress } from '../../../../utils/displayAddress';
import { Button, Input } from '../../../core/primitives';
import { ClassTokens, Icons } from '../../../theme';
import { ChannelNotificationsToggle } from './ChannelNotificationsToggle';

const ADDRESS_TYPE = AddressType.Wallet;

export const WalletChannel = () => {
  //TODO dapp context
  const dappAddress = '';
  const {
    wallet: { address: walletAddress },
  } = useDialectSdk();

  const { create: createThread, isCreatingThread } = useThreads();

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

  const {
    thread,
    delete: deleteThread,
    isDeletingThread,
  } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
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
        <div
          onClick={deleteWalletThread}
          className={clsx(ClassTokens.Icon.Tertiary, 'dt-p-2')}
        >
          <Icons.Trash />
        </div>
      );
    return <Button onClick={setUpWallet}>Enable</Button>;
  }, [deleteWalletThread, isLoading, isWalletSetUp, setUpWallet]);

  return (
    <div className="dt-flex dt-flex-col dt-gap-2">
      <Input
        label="Wallet" //TODO 'In App' instead of 'Wallet' ?
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
