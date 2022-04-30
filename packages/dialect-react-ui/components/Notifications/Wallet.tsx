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
import { display } from '@dialectlabs/web3';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function Wallet(props: { onThreadDelete?: () => void }) {
  const {
    wallet,
    network,
    addresses: { wallet: walletObj },
    saveAddress,
    updateAddress,
  } = useApi();
  const {
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
  const isEnabled = walletObj ? walletObj?.enabled : isDialectAvailable;

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
          createDialect()
            .then(() => {
              saveAddress(wallet, {
                type: 'wallet',
                value: wallet?.publicKey,
                enabled: true,
              });
            })
            .catch(noop);
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

  if (isDialectAvailable) {
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
            <Button
              className="dt-w-full"
              defaultStyle={secondaryDangerButton}
              loadingStyle={secondaryDangerButtonLoading}
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props?.onThreadDelete?.();
              }}
              loading={isDialectDeleting}
            >
              Withdraw rent & delete history
            </Button>
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
      enabled={isEnabled}
      onChange={(nextValue) => {
        if (
          (isDialectAvailable && !nextValue) ||
          (isDialectAvailable && nextValue)
        ) {
          updateAddress(wallet, {
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
