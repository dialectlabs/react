import {
  AccountAddress,
  AddressType,
  Thread,
  ThreadMemberScope,
  useDialectSdk,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback } from 'react';
import { shortenAddress } from '../../../../utils/displayUtils';
import { Button, Loader, Toggle } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import IconButton from '../../../IconButton';

type Web3Props = {
  dappAddress: AccountAddress;
  onThreadDeleted?: () => void;
  onThreadCreated?: (thread: Thread) => void;
  showLabel?: boolean;
};

const ADDRESS_TYPE = AddressType.Wallet;

const Wallet = ({
  dappAddress,
  onThreadDeleted,
  onThreadCreated,
  showLabel = true,
}: Web3Props) => {
  const {
    wallet: { address: walletAddress },
  } = useDialectSdk();
  const { textStyles, outlinedInput, adornmentButton, icons, colors } =
    useTheme();
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
    delete: deleteDialect,
    isDeletingThread,
  } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const deleteThread = useCallback(async () => {
    await deleteDialect();
    await deleteAddress();
    onThreadDeleted?.();
  }, [deleteAddress, deleteDialect, onThreadDeleted]);

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
    [createAddress, walletAddress]
  );

  const fullEnableWallet = useCallback(async () => {
    const address = await createWalletAddress();
    const thread = await createWalletThread();
    if (!thread) {
      return;
    }
    await toggleSubscription({ enabled: true, address });
    onThreadCreated?.(thread);
  }, [
    createWalletAddress,
    createWalletThread,
    onThreadCreated,
    toggleSubscription,
  ]);

  const isLoading =
    isDeletingThread ||
    isCreatingThread ||
    isDeletingAddress ||
    isCreatingAddress ||
    isToggling;

  const walletEnabled = thread && walletSubscriptionAddress;

  return (
    <div>
      {showLabel && (
        <label
          htmlFor="settings-email"
          className={clsx(colors.label, textStyles.label, 'dt-block dt-mb-1')}
        >
          Wallet
        </label>
      )}
      <div
        className={clsx(
          'dt-flex dt-items-center dt-border !dt-bg-transparent',
          outlinedInput
        )}
      >
        <div
          className={clsx(
            'dt-w-full dt-bg-transparent dt-outline-0',
            textStyles.input
          )}
        >
          <div className="dt-flex dt-justify-between dt-items-center">
            <span className={'dt-opacity-40'}>
              {shortenAddress(walletAddress || '')}
            </span>
            {walletEnabled && !isLoading && (
              <IconButton
                className={clsx(adornmentButton, 'dt-w-9 dt-h-9')}
                icon={<icons.trash />}
                onClick={deleteThread}
              />
            )}
            {/* when no address and thread */}
            {!thread && !walletSubscriptionAddress && !isLoading && (
              <Button
                onClick={fullEnableWallet}
                className={clsx(adornmentButton, 'dt-w-16 dt-h-9')}
              >
                Enable
              </Button>
            )}
            {/* when address exists but no thread */}
            {walletSubscriptionAddress && !thread && !isLoading && (
              <Button
                onClick={createWalletThread}
                className={clsx(adornmentButton, 'dt-w-16 dt-h-9')}
              >
                Enable
              </Button>
            )}
            {/* when thread exists but no address
                Probably this is a *very* old users case */}
            {thread && !walletSubscriptionAddress && !isLoading && (
              <Button
                onClick={createWalletAddress}
                className={clsx(adornmentButton, 'dt-w-16 dt-h-9')}
              >
                Enable
              </Button>
            )}
            {isLoading && (
              <div
                className={clsx(
                  'dt-h-9 dt-w-9 dt-rounded-full dt-flex dt-items-center dt-justify-center dt-text-xs dt-border-0 dt-opactity-60',
                  colors.textPrimary
                )}
              >
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      {walletEnabled && (
        <div className="dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1">
          <Toggle
            type="checkbox"
            checked={subscriptionEnabled}
            toggleSize="S"
            onChange={(checked) => {
              if (isToggling) return;
              return toggleSubscription({ enabled: checked });
            }}
          />

          <P className={clsx(textStyles.small, 'dt-opacity-60')}>
            Notifications {subscriptionEnabled ? 'on' : 'off'}
          </P>
        </div>
      )}
    </div>
  );
};

export default Wallet;
