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
import { useEffect } from 'react';

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
  const isWalletEnabled = walletObj ? walletObj?.enabled : isDialectAvailable;

  useEffect(() => {
    if (!isDialectAvailable && walletObj) {
      //   sync state in case of errors
      deleteAddress(wallet, {
        addressId: walletObj?.addressId,
      });
    }
  }, [isDialectAvailable, wallet, walletObj, walletObj?.addressId]);

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
          if (!walletObj) {
            await saveAddress(wallet, {
              type: 'wallet',
              value: wallet?.publicKey,
              enabled: true,
            });
          }
          createDialect().catch(() => {
            if (walletObj) {
              updateAddress(wallet, {
                type: 'wallet',
                value: wallet?.publicKey,
                enabled: false,
              });
            }
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
                  if (walletObj) {
                    // Support for threads created before address registry launch
                    deleteAddress(wallet, {
                      addressId: walletObj?.addressId,
                    }).catch(noop);
                  }
                  await deleteDialect().catch(() => {
                    if (!walletObj) {
                      saveAddress(wallet, {
                        type: 'wallet',
                        value: wallet?.publicKey,
                        enabled: true,
                      });
                    }
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
        if (isDialectAvailable && walletObj) {
          await updateAddress(wallet, {
            ...walletObj,
            value: wallet?.publicKey,
            enabled: nextValue,
          });
        }
      }}
    >
      {content}
    </ToggleSection>
  );
}
