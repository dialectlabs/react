import { Thread, useAddresses, useThread } from '@dialectlabs/react-sdk';
import {
  Backend,
  ThreadMemberScope,
  useDialectConnectionInfo,
  useDialectDapp,
  useDialectSdk,
  useThreads,
} from '@dialectlabs/react-sdk';
import { display } from '@dialectlabs/web3';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import {
  Button,
  NetworkBadge,
  Toggle,
  useBalance,
  ValueRow,
} from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import { RouteName } from '../../constants';

const CreateNotificationsThread = () => {
  const {
    info: {
      wallet,
      config: { solana: { network } = {} },
    },
  } = useDialectSdk();

  const { isCreatingAddress } = useAddresses();

  const {
    connected: {
      solana: { shouldConnect: isSolanaShouldConnect },
      dialectCloud: { shouldConnect: isDialectCloudShouldConnect },
    },
  } = useDialectConnectionInfo();

  const { dappAddress } = useDialectDapp();

  const { navigate } = useRoute();

  const isBackendSelectable =
    isSolanaShouldConnect && isDialectCloudShouldConnect;
  const [isOffChain, setIsOffChain] = useState(isDialectCloudShouldConnect);

  const backend =
    !isOffChain && isSolanaShouldConnect
      ? Backend.Solana
      : Backend.DialectCloud;

  const { create, isCreatingThread, errorCreatingThread } = useThreads();
  const { thread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const showThread = useCallback(
    (thread: Thread) => {
      navigate(RouteName.Thread, {
        params: {
          threadId: thread.id,
        },
      });
    },
    [navigate]
  );

  const { textStyles } = useTheme();

  const { balance } = useBalance();

  const createDialect = useCallback(async () => {
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
            className={'dt-w-full dt-mb-3'}
          >
            0.058 SOL
          </ValueRow>
        </>
      ) : null}
      <Button
        className="dt-mb-2"
        onClick={createDialect}
        loading={isCreatingThread || isCreatingAddress}
        disabled={Boolean(thread) || isCreatingThread || isCreatingAddress}
      >
        {isCreatingThread
          ? 'Creating...'
          : `Create ${isOffChain ? '' : 'on-chain'} notifications thread`}
      </Button>
      {!isOffChain ? (
        <P
          className={clsx(
            textStyles.small,
            'dt-p-1 dt-opacity-50 dt-text-left'
          )}
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
            className={clsx(
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

export default CreateNotificationsThread;
