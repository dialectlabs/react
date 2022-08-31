import {
  AddressType,
  Backend,
  Thread,
  ThreadMemberScope,
  useDialectConnectionInfo,
  useDialectDapp,
  useDialectWallet,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';
import { useTheme } from '../common/providers/DialectThemeProvider';
import type { Channel } from '../common/types';
import SubscribeRow from './SubscribeRow';
import NotificationsModal from '../NotificationsModal';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { useCallback } from 'react';
import { shortenAddress } from '../../utils/displayUtils';

export type NotificationType = {
  name: string;
  detail?: string;
};

interface SubscribeProps {
  onWalletConnect: () => void;
  onModalClose: () => void;
  notifications?: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
  gatedView?: string | JSX.Element;
  pollingInterval?: number;
  onSubscribe?: (thread: Thread) => void;
}

const addressType = AddressType.Wallet;
const DIALECT_UI_ID = 'subscribe';

interface SafeSubscribeProps {
  onOpenMoreOptions: () => void;
  onSubscribe?: (thread: Thread) => void;
}

function SafeSubscribe({ onOpenMoreOptions }: SafeSubscribeProps) {
  const {
    adapter: wallet,
    isSigningMessage,
    isEncrypting,
    isSigningFreeTransaction,
  } = useDialectWallet();
  const isWalletConnected = wallet.connected;

  const isWalletLoading =
    isSigningMessage || isEncrypting || isSigningFreeTransaction;

  const connectWallet = () => {
    // TODO: initiate wallet connection;
  };

  if (!isWalletConnected) {
    return (
      <SubscribeRow
        label="Connect wallet"
        isSubscribed={false}
        isLoading={isWalletLoading}
        onSubscribe={connectWallet}
      />
    );
  }

  return <ConnectedSubscribe onOpenMoreOptions={onOpenMoreOptions} />;
}

interface ConnectedSubscribeProps {
  onOpenMoreOptions: () => void;
  onSubscribe?: (thread: Thread) => void;
}

function ConnectedSubscribe({
  onOpenMoreOptions,
  onSubscribe,
}: ConnectedSubscribeProps): JSX.Element {
  const { adapter: wallet } = useDialectWallet();

  const { dappAddress } = useDialectDapp();
  if (!dappAddress) {
    throw new Error(
      'dapp address should be provided for subscribe button to work'
    );
  }

  const { create: createThread, isCreatingThread } = useThreads();

  const {
    globalAddress: walletAddress,
    create: createAddress,
    isCreatingAddress,
    isDeletingAddress,
  } = useNotificationChannel({ addressType });

  const {
    enabled: subscriptionEnabled,
    toggleSubscription,
    isToggling,
    isFetchingSubscriptions,
  } = useNotificationChannelDappSubscription({
    addressType,
  });

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

  const { thread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const createWalletThread = useCallback(async () => {
    if (!dappAddress) return;
    return createThread({
      me: { scopes: [ThreadMemberScope.ADMIN] },
      otherMembers: [
        { publicKey: dappAddress, scopes: [ThreadMemberScope.WRITE] },
      ],
      encrypted: false,
      backend,
    });
  }, [backend, createThread, dappAddress]);

  const createWalletAddress = useCallback(async () => {
    if (!wallet.publicKey) {
      return;
    }
    return createAddress({ value: wallet.publicKey?.toBase58() });
  }, [createAddress, wallet.publicKey]);

  const fullEnableWallet = useCallback(async () => {
    const address = await createWalletAddress();
    const thread = await createWalletThread();
    if (!thread) {
      return;
    }
    await toggleSubscription({ enabled: true, address });
    onSubscribe?.(thread);
  }, [
    createWalletAddress,
    createWalletThread,
    onSubscribe,
    toggleSubscription,
  ]);

  const handleSubscribe = useCallback(() => {
    /* when no address and thread */
    if (!thread && !walletAddress) {
      return fullEnableWallet();
    }

    /* when address exists but no thread */
    if (!thread && walletAddress) {
      return createWalletThread();
    }

    if (thread && !subscriptionEnabled) {
      return toggleSubscription({ enabled: true });
    }

    /* when thread exists but no address
    Probably this is a *very* old users case */
    if (thread && !walletAddress) {
      return createWalletAddress();
    }
  }, [
    createWalletAddress,
    createWalletThread,
    fullEnableWallet,
    subscriptionEnabled,
    thread,
    toggleSubscription,
    walletAddress,
  ]);

  const isLoading =
    isFetchingSubscriptions ||
    isCreatingThread ||
    isDeletingAddress ||
    isCreatingAddress ||
    isToggling;

  const isSubscribed = Boolean(thread && walletAddress && subscriptionEnabled);

  return (
    <SubscribeRow
      label={shortenAddress(wallet.publicKey || '')}
      isSubscribed={isSubscribed}
      isLoading={isLoading}
      onOpenMoreOptions={onOpenMoreOptions}
      onSubscribe={handleSubscribe}
    />
  );
}

function InnerSubscribe({
  onSubscribe,
  onWalletConnect,
  channels,
}: SubscribeProps) {
  const { open: openModal } = useDialectUiId(DIALECT_UI_ID);

  return (
    <div className="dt-w-full">
      <WalletStatesWrapper>
        {({ isWalletConnected, isSigningMessage }) => {
          if (!isWalletConnected || isSigningMessage) {
            return (
              <SubscribeRow
                label={
                  isSigningMessage
                    ? 'Waiting for wallet...'
                    : 'Connect wallet...'
                }
                isSubscribed={false}
                isLoading={isSigningMessage}
                onSubscribe={onWalletConnect}
              />
            );
          }
          return <ConnectedSubscribe onOpenMoreOptions={openModal} />;
        }}
      </WalletStatesWrapper>
      <NotificationsModal
        wrapperClassName="!dt-fixed !dt-top-0 !dt-bottom-0 !dt-left-0 !dt-right-0 dt-m-auto"
        dialectId={DIALECT_UI_ID}
        channels={channels}
        animationStyle="bottomSlide"
        settingsOnly
      />
    </div>
  );
}

export default function Subscribe(props: SubscribeProps) {
  const { colors } = useTheme();

  return (
    <div className="dialect dt-w-full">
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.textPrimary
        )}
      >
        {/* TODO: do not initiate sign until user interaction */}
        {/* TODO: remove ledger toggle for this component */}
        {/* TODO: connection wrapper */}
        <InnerSubscribe {...props} />
      </div>
    </div>
  );
}