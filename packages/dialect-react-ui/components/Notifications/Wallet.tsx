import { useApi, useDialect } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { A, P } from '../common/preflighted';
import {
  Button,
  NetworkBadge,
  ToggleSection,
  useBalance,
  ValueRow,
} from '../common';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import { display, isDialectAdmin } from '@dialectlabs/web3';
import { useCallback, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function Wallet(props: { onThreadDelete?: () => void }) {
  const {
    wallet,
    network,
    addresses: { wallet: walletObj },
    saveAddress,
    updateAddress,
    deleteAddress,
  } = useApi();
  const {
    dialect,
    createDialect,
    isDialectCreating,
    isDialectAvailable,
    dialectAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
    creationError,
  } = useDialect();
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
    isDialectCreating ||
    isDialectDeleting;

  const deleteWallet = useCallback(async () => {
    if (!walletObj) return;
    await deleteAddress(wallet, {
      addressId: walletObj?.addressId,
    }).catch(noop);
  }, [deleteAddress, wallet, walletObj]);

  const saveWallet = useCallback(async () => {
    if (walletObj) return;
    await saveAddress(wallet, {
      type: 'wallet',
      value: wallet?.publicKey,
      enabled: true,
    }).catch(noop);
  }, [saveAddress, wallet, walletObj]);

  const updateWalletEnabled = useCallback(
    async (enabled: boolean) => {
      if (!walletObj) return;
      await updateAddress(wallet, {
        ...walletObj,
        type: 'wallet',
        value: wallet?.publicKey,
        enabled,
      }).catch(noop);
    },
    [updateAddress, walletObj, wallet]
  );

  useEffect(() => {
    if (
      isDialectCreating ||
      isDialectDeleting ||
      (isDialectAvailable && walletObj)
    )
      return;

    // Sync state in case of errors
    if (isDialectAvailable && !walletObj) {
      // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created
      saveWallet();
    } else if (!isDialectAvailable && walletObj) {
      // In case the wallet isn't in web2 db, but the actual thread was created
      deleteWallet();
    }
  }, [
    isDialectAvailable,
    isDialectCreating,
    isDialectDeleting,
    wallet,
    deleteWallet,
    saveWallet,
    walletObj,
    walletObj?.addressId,
  ]);

  const isAdmin =
    dialect && wallet?.publicKey && isDialectAdmin(dialect, wallet.publicKey);

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
          await saveWallet();
          createDialect().catch(async () => {
            await updateWalletEnabled(false);
          });
        }}
        loading={isDialectCreating}
      >
        {isDialectCreating
          ? 'Creating...'
          : 'Create on-chain notifications thread'}
      </Button>
      <P className={cs(textStyles.small, 'dt-p-1 dt-opacity-50 dt-text-left')}>
        To start this notifications thread, you&apos;ll need to deposit a small
        amount of rent, since messages are stored on-chain.
      </P>
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {/* TODO: move red color to the theme */}
      {creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN' && (
        <P
          className={cs(
            textStyles.small,
            'dt-text-red-500 dt-text-left dt-mt-2'
          )}
        >
          {creationError.message}
        </P>
      )}
    </div>
  );

  if ((isWalletEnabled && !isDialectCreating) || isDialectDeleting) {
    content = (
      <div>
        {isDialectAvailable && dialectAddress ? (
          <ValueRow
            label={
              <>
                <P className={cs(textStyles.small, 'dt-opacity-60')}>
                  Notifications account address
                </P>
                <P>
                  <A
                    target="_blank"
                    href={getExplorerAddress(dialectAddress, network)}
                    rel="noreferrer"
                  >
                    {display(dialectAddress)}↗
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
        {isDialectAvailable && dialectAddress ? (
          <>
            {isAdmin ? (
              <Button
                className="dt-w-full"
                defaultStyle={secondaryDangerButton}
                loadingStyle={secondaryDangerButtonLoading}
                onClick={async () => {
                  // TODO: refactor: save the signature and wait for deletion before firing
                  deleteWallet();
                  await deleteDialect().catch(() => {
                    // If deletion failed — save wallet again
                    saveWallet();
                  });
                  // TODO: properly wait for the deletion
                  props?.onThreadDelete?.();
                }}
                loading={isDialectDeleting}
              >
                Withdraw rent & delete history
              </Button>
            ) : null}
            {deletionError &&
            deletionError.type !== 'DISCONNECTED_FROM_CHAIN' ? (
              <P
                className={cs(
                  textStyles.small,
                  xPaddedText,
                  'dt-text-red-500 dt-mt-2'
                )}
              >
                {deletionError.message}
              </P>
            ) : (
              <P
                className={cs(
                  textStyles.small,
                  xPaddedText,
                  'dt-opacity-50 dt-mt-2'
                )}
              >
                Notification history will be lost forever
              </P>
            )}
          </>
        ) : null}
      </div>
    );
  }
  return (
    <ToggleSection
      className="dt-mb-6"
      title="💬  Web3 wallet notifications"
      enabled={isWalletEnabled}
      onChange={async (nextValue) => {
        await updateWalletEnabled(nextValue);
      }}
    >
      {content}
    </ToggleSection>
  );
}
