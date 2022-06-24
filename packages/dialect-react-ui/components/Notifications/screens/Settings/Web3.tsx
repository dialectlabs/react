import { useCallback, useEffect } from 'react';
import { ThreadMemberScope, Backend } from '@dialectlabs/sdk';
import { display } from '@dialectlabs/web3';
import {
  useDialectCloudApi,
  useDialectSdk,
  useThreads,
  useDialectDapp,
  useThread,
} from '@dialectlabs/react-sdk';
import cs from '../../../../utils/classNames';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { A, P } from '../../../common/preflighted';
import {
  Button,
  NetworkBadge,
  ToggleSection,
  useBalance,
  ValueRow,
} from '../../../common';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type Web3Props = {
  onThreadDelete?: () => void;
};

export function Web3(props: Web3Props) {
  const {
    info: {
      wallet,
      config: { solana: { network } = {} },
    },
  } = useDialectSdk();
  const { dappAddress } = useDialectDapp();

  const { create, isCreatingThread, errorCreatingThread } = useThreads();
  const {
    thread,
    delete: deleteDialect,
    isDeletingThread,
    errorDeletingThread,
    isAdminable,
  } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });
  const isDialectAvailable = Boolean(thread);
  const {
    addresses: { wallet: walletObj },
    saveAddress,
    updateAddress,
    deleteAddress,
  } = useDialectCloudApi();

  const {
    textStyles,
    xPaddedText,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
  } = useTheme();

  const { balance } = useBalance();
  // Support for threads created before address registry launch
  const isWalletEnabled =
    (walletObj ? walletObj?.enabled : isDialectAvailable) ||
    isCreatingThread ||
    isDeletingThread;

  const deleteWeb3 = useCallback(async () => {
    if (!walletObj) return;
    await deleteAddress({
      addressId: walletObj?.addressId,
    }).catch(noop);
  }, [deleteAddress, walletObj]);

  const saveWeb3 = useCallback(async () => {
    if (walletObj) return;
    await saveAddress({
      type: 'wallet',
      value: wallet?.publicKey,
      enabled: true,
    }).catch(noop);
  }, [saveAddress, walletObj, wallet]);

  const updateWeb3Enabled = useCallback(
    async (enabled: boolean) => {
      if (!walletObj) return;
      await updateAddress({
        ...walletObj,
        type: 'wallet',
        value: wallet?.publicKey,
        enabled,
      }).catch(noop);
    },
    [updateAddress, walletObj, wallet]
  );

  // TODO: move to the Notifications/index.tsx component
  useEffect(() => {
    if (
      isCreatingThread ||
      isDeletingThread ||
      (isDialectAvailable && walletObj)
    )
      return;

    // Sync state in case of errors
    if (isDialectAvailable && !walletObj) {
      // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created
      saveWeb3();
    } else if (!isDialectAvailable && walletObj) {
      // In case the wallet isn't in web2 db, but the actual thread was created
      deleteWeb3();
    }
  }, [
    isDialectAvailable,
    isCreatingThread,
    isDeletingThread,
    wallet,
    deleteWeb3,
    saveWeb3,
    walletObj,
    walletObj?.addressId,
  ]);

  let content = (
    <div className="dt-h-full dt-m-auto dt-flex dt-flex-col">
      {wallet ? (
        <ValueRow
          label={
            <>
              Balance ({wallet?.publicKey ? display(wallet?.publicKey) : ''}){' '}
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
      <Button
        className="dt-mb-2"
        onClick={async () => {
          await saveWeb3();

          create({
            me: { scopes: [ThreadMemberScope.ADMIN] },
            otherMembers: [
              { publicKey: dappAddress, scopes: [ThreadMemberScope.WRITE] },
            ],
            encrypted: false,
          })
            .then(async (thread) => {
              // TODO: do whatever needed for frefh created thread
            })
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .catch(async (e) => {
              console.log(e);
              // await updateWeb3Enabled(false);
            });
        }}
        loading={isCreatingThread}
      >
        {isCreatingThread
          ? 'Creating...'
          : 'Create on-chain notifications thread'}
      </Button>
      <P className={cs(textStyles.small, 'dt-p-1 dt-opacity-50 dt-text-left')}>
        To start this notifications thread, you&apos;ll need to deposit a small
        amount of rent, since messages are stored on-chain.
      </P>
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

  if ((isWalletEnabled && !isCreatingThread) || isDeletingThread) {
    content = (
      <div>
        {isDialectAvailable && thread ? (
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
                    {display(thread?.id.address)}↗
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
        {isDialectAvailable && thread ? (
          <>
            {isAdminable ? (
              <div>
                <Button
                  className="dt-w-full"
                  defaultStyle={secondaryDangerButton}
                  loadingStyle={secondaryDangerButtonLoading}
                  onClick={async () => {
                    // TODO: refactor: save the signature and wait for deletion before firing
                    deleteWeb3();
                    await deleteDialect().catch(() => {
                      // If deletion failed — save wallet again
                      saveWeb3();
                    });
                    // TODO: properly wait for the deletion
                    props?.onThreadDelete?.();
                  }}
                  loading={isDeletingThread}
                >
                  Withdraw rent & delete history
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
            ) : null}
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
  }
  return (
    <ToggleSection
      className="dt-mb-6"
      title="💬  Wallet notifications"
      enabled={isWalletEnabled}
      onChange={async (nextValue) => {
        await updateWeb3Enabled(nextValue);
      }}
    >
      {content}
    </ToggleSection>
  );
}
