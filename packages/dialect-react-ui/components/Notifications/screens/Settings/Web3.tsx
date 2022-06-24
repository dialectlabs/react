import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThreadMemberScope, Thread, ThreadId, Backend } from '@dialectlabs/sdk';
import { display } from '@dialectlabs/web3';
import {
  useDialectCloudApi,
  useDialectSdk,
  useThreads,
  useDialectDapp,
  useThread,
  useDialectConnectionInfo,
} from '@dialectlabs/react-sdk';
import cs from '../../../../utils/classNames';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { A, P } from '../../../common/preflighted';
import {
  Button,
  NetworkBadge,
  Toggle,
  ToggleSection,
  useBalance,
  ValueRow,
} from '../../../common';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const CreateNotificationsThread = ({
  onThreadCreated,
  onThreadCreationFailed,
}) => {
  const {
    info: {
      wallet,
      config: { solana: { network } = {} },
    },
  } = useDialectSdk();

  const {
    connected: {
      solana: { shouldConnect: isSolanaShouldConnect },
      dialectCloud: { shouldConnect: isDialectCloudShouldConnect },
    },
  } = useDialectConnectionInfo();

  const { dappAddress } = useDialectDapp();

  const { create } = useThreads();

  const isBackendSelectable =
    isSolanaShouldConnect && isDialectCloudShouldConnect;
  const [isOffChain, setIsOffChain] = useState(isDialectCloudShouldConnect);

  const backend =
    !isOffChain && isSolanaShouldConnect
      ? Backend.Solana
      : Backend.DialectCloud;

  const { isCreatingThread, errorCreatingThread } = useThreads();

  const { textStyles } = useTheme();

  const { balance } = useBalance();

  const createDialect = useCallback(() => {
    if (!dappAddress) return;
    create({
      me: { scopes: [ThreadMemberScope.ADMIN] },
      otherMembers: [
        { publicKey: dappAddress, scopes: [ThreadMemberScope.WRITE] },
      ],
      encrypted: false,
      backend,
    })
      .then(async (thread) => {
        console.log('successfuly created thread', thread);
        // TODO: do whatever needed for frefh created thread
        onThreadCreated?.(thread);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(async (e) => {
        console.log('error while creating thread', e);
        onThreadCreationFailed?.(e);
      });
  }, [backend, create, dappAddress, onThreadCreated, onThreadCreationFailed]);

  return (
    <div className="dt-h-full dt-m-auto dt-flex dt-flex-col">
      {isBackendSelectable ? (
        <ValueRow
          className="dt-mb-2"
          label={
            isOffChain ? (
              <span className="dt-flex dt-items-center">💬 Off-chain</span>
            ) : (
              <span className="dt-flex dt-items-center">⛓ On-chain</span>
            )
          }
        >
          <span className="dt-flex dt-items-center">
            <Toggle
              checked={isOffChain}
              onClick={() => setIsOffChain((enc) => !enc)}
            />
          </span>
        </ValueRow>
      ) : null}
      {!isOffChain ? (
        <>
          {wallet ? (
            <ValueRow
              label={
                <>
                  Balance ({wallet.publicKey ? display(wallet.publicKey) : ''}){' '}
                  <NetworkBadge network={network} />
                </>
              }
              className="dt-mb-2"
            >
              <span className="dt-text-right">{balance || 0} SOL</span>
            </ValueRow>
          ) : null}
          <ValueRow
            label="Rent Deposit (recoverable)"
            className={cs('dt-w-full dt-mb-3')}
          >
            0.058 SOL
          </ValueRow>
        </>
      ) : null}
      <Button
        className="dt-mb-2"
        onClick={createDialect}
        loading={isCreatingThread}
      >
        {isCreatingThread
          ? 'Creating...'
          : `Create ${isOffChain ? '' : 'on-chain'} notifications thread`}
      </Button>
      {!isOffChain ? (
        <P
          className={cs(textStyles.small, 'dt-p-1 dt-opacity-50 dt-text-left')}
        >
          To start this notifications thread, you&apos;ll need to deposit a
          small amount of rent, since messages are stored on-chain.
        </P>
      ) : null}
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {/* TODO: move red color to the theme */}
      {errorCreatingThread &&
        errorCreatingThread.type !== 'DISCONNECTED_FROM_CHAIN' && (
          <P
            className={cs(
              textStyles.small,
              'dt-text-red-500 dt-text-left dt-mt-2'
            )}
          >
            {errorCreatingThread.message}
          </P>
        )}
    </div>
  );
};

interface ThreadSettingsProps {
  onThreadDelete: () => void;
}

const NotificationsThreadSettings = ({
  onThreadDelete,
}: ThreadSettingsProps) => {
  const {
    textStyles,
    xPaddedText,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
  } = useTheme();

  const {
    info: {
      config: { solana: { network } = {} },
    },
  } = useDialectSdk();

  const { dappAddress } = useDialectDapp();

  const findParams = useMemo(
    () => ({ otherMembers: dappAddress ? [dappAddress] : [] }),
    [dappAddress.toBase58()]
  );

  const { thread, isDeletingThread, errorDeletingThread, isAdminable } =
    useThread({
      findParams,
    });

  if (!thread) {
    return null;
  }

  const isOnChain = thread.backend === Backend.Solana;

  return (
    <div>
      {isOnChain ? (
        <ValueRow
          label={
            <>
              <P className={cs(textStyles.small, 'dt-opacity-60')}>
                Notifications account address
              </P>
              <P>
                <A
                  target="_blank"
                  href={getExplorerAddress(
                    thread.id.address.toBase58(),
                    network
                  )}
                  rel="noreferrer"
                >
                  {display(thread.id.address)}↗
                </A>
              </P>
            </>
          }
          className="dt-mt-1 dt-mb-2"
        >
          <span className="dt-text-right">
            <P className={cs(textStyles.small, 'dt-opacity-60')}>
              Deposited Rent
            </P>
            <P>0.058 SOL</P>
          </span>
        </ValueRow>
      ) : null}
      {isAdminable ? (
        <>
          <div>
            <Button
              className="dt-w-full"
              defaultStyle={secondaryDangerButton}
              loadingStyle={secondaryDangerButtonLoading}
              onClick={onThreadDelete}
              loading={isDeletingThread}
            >
              {isOnChain ? 'Withdraw rent and delete history' : 'Delete thread'}
            </Button>
            <P
              className={cs(
                textStyles.small,
                xPaddedText,
                'dt-opacity-50 dt-mt-2'
              )}
            >
              Notification history will be lost forever
            </P>
          </div>
          {errorDeletingThread &&
          errorDeletingThread.type !== 'DISCONNECTED_FROM_CHAIN' ? (
            <P
              className={cs(
                textStyles.small,
                xPaddedText,
                'dt-text-red-500 dt-mt-2'
              )}
            >
              {errorDeletingThread.message}
            </P>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

type Web3Props = {
  onThreadDelete?: () => void;
};

export function Web3(props: Web3Props) {
  const {
    info: { wallet },
  } = useDialectSdk();
  // TODO: fix use sdk call when wallet is not available
  const { dappAddress } = useDialectDapp();
  const [isDeletingAddress, setDeletingAddress] = useState(false);
  const [isSavingAddress, setSavingAddress] = useState(false);
  const [isUpdatingAddress, setUpdatingAddress] = useState(false);

  const { threads, create, isCreatingThread } = useThreads();
  const findParams = useMemo(
    () => ({ otherMembers: dappAddress ? [dappAddress] : [] }),
    [dappAddress.toBase58()]
  );
  const {
    thread,
    delete: deleteDialect,
    isFetchingThread,
    isDeletingThread,
  } = useThread({
    findParams,
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

  // console.log('isWalletEnabled=', isWalletEnabled, {
  //   walletObj,
  //   'walletObj?.enabled': walletObj?.enabled,
  //   isDialectAvailable,
  //   isSavingAddress,
  //   isCreatingThread,
  //   isDeletingAddress,
  //   isDeletingThread,
  //   thread,
  //   threads,
  // });

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
            console.log('deleted');
            await deleteWeb3();
            // props?.onThreadDelete?.();
          })
          .catch(() => {
            console.log('error while deletion');
          });
        // TODO: properly wait for the deletion
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
