import {
  AddressType,
  Backend,
  Thread,
  ThreadMemberScope,
  useAddresses,
  useDialectConnectionInfo,
  useDialectDapp,
  useDialectWallet,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import { display } from '@dialectlabs/web3';
import clsx from 'clsx';
import { useCallback } from 'react';
import { Button, Loader, Toggle } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import IconButton from '../../../IconButton';
import { RouteName } from '../../constants';

type Web3Props = {
  onThreadDeleted?: () => void;
};

const addressType = AddressType.Wallet;

const Wallet = ({ onThreadDeleted }: Web3Props) => {
  const wallet = useDialectWallet();
  const { dappAddress } = useDialectDapp();
  const { textStyles, outlinedInput, addormentButton } = useTheme();
  const { icons } = useTheme();
  const { create, isCreatingThread } = useThreads();
  const { navigate } = useRoute();

  const {
    addresses: { WALLET: walletObj },
    toggle: toggleAddress,
    delete: deleteAddress,
    isCreatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const {
    connected: {
      solana: { shouldConnect: isSolanaShouldConnect },
      dialectCloud: { shouldConnect: isDialectCloudShouldConnect },
    },
  } = useDialectConnectionInfo();

  const isBackendSelectable =
    isSolanaShouldConnect && isDialectCloudShouldConnect;

  const backend =
    isSolanaShouldConnect && !isBackendSelectable
      ? Backend.Solana
      : Backend.DialectCloud;

  const { thread, delete: deleteDialect } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const { isDeletingThread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const deleteThread = useCallback(async () => {
    await deleteDialect();
    await deleteAddress({ addressType });
    onThreadDeleted?.();
  }, [deleteAddress, deleteDialect, onThreadDeleted]);

  const showThread = (thread: Thread) => {
    navigate(RouteName.Thread, {
      params: {
        threadId: thread.id,
      },
    });
  };

  const createThread = useCallback(async () => {
    if (!dappAddress) return;
    try {
      const thread = await create({
        me: { scopes: [ThreadMemberScope.ADMIN] },
        otherMembers: [
          { publicKey: dappAddress, scopes: [ThreadMemberScope.WRITE] },
        ],
        encrypted: false,
        backend,
      });

      // Address would be created by syncState effect

      await showThread(thread);
    } catch (e) {
      // TODO: do we need to do smth here?
    }
  }, [backend, create, dappAddress, showThread]);

  const isLoading = isDeletingThread || isCreatingThread || isDeletingAddress;

  const toggleWeb3 = async (nextValue: boolean) => {
    if (!walletObj || walletObj?.enabled === nextValue) {
      return;
    }
    await toggleAddress({
      addressType: AddressType.Wallet,
      enabled: nextValue,
    });
  };

  const isWeb3Enabled =
    walletObj?.enabled ||
    isCreatingThread ||
    isCreatingAddress ||
    isDeletingThread ||
    isDeletingAddress;

  return (
    <div>
      <label
        htmlFor="settings-email"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Wallet
      </label>
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
              {display(wallet.adapter.publicKey || '')}
            </span>
            {thread && !isLoading && (
              <IconButton
                className={clsx(addormentButton, 'dt-w-9 dt-h-9')}
                icon={<icons.trash />}
                onClick={deleteThread}
              />
            )}
            {!thread && !isLoading && (
              <Button
                onClick={createThread}
                className={clsx(addormentButton, 'dt-w-16 dt-h-9')}
              >
                Enable
              </Button>
            )}
            {isLoading && (
              <div
                className={
                  'dt-h-9 dt-w-9 dt-rounded-full dt-flex dt-items-center dt-justify-center dt-text-white dt-text-xs dt-border-0 dt-opactity-60'
                }
              >
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      {walletObj && (
        <div className="dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1">
          <Toggle
            type="checkbox"
            checked={isWeb3Enabled}
            toggleSize="S"
            onClick={async () => {
              const nextValue = !isWeb3Enabled;
              await toggleWeb3?.(nextValue);
            }}
          />

          <P className={clsx(textStyles.small, 'dt-opacity-60')}>
            Notifications {isWeb3Enabled ? 'on' : 'off'}
          </P>

          {backend === Backend.Solana && (
            <P className={clsx(textStyles.small, 'dt-opacity-40')}>
              | Rent Deposit (recoverable): 0.058 SOL
            </P>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;
