import {
  AccountAddress,
  AddressType,
  Thread,
  ThreadMemberScope,
  useDialectSdk,
  useDialectWallet,
  useNotificationChannel,
  useNotificationChannelDappSubscription,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import { shortenAddress } from '../../utils/displayUtils';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import type { Channel } from '../common/types';
import NotificationsModal from '../NotificationsModal';
import SubscribeRow from './SubscribeRow';

export type NotificationType = {
  name: string;
  detail?: string;
};

interface SubscribeProps {
  dialectId: string;
  dappAddress: AccountAddress;
  buttonLabel?: string;
  successLabel?: string;
  label?: string;
  onWalletConnect: () => void;
  notifications?: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
  gatedView?: string | JSX.Element;
  pollingInterval?: number;
  onSubscribe?: (thread: Thread) => void;
}

const addressType = AddressType.Wallet;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FN = () => {};
interface SafeSubscribeProps {
  dappAddress: AccountAddress;
  label?: string;
  buttonLabel?: string;
  successLabel?: string;
  onWalletConnect: () => void;
  onOpenMoreOptions: () => void;
  onSubscribe?: (thread: Thread) => void;
}

function SafeSubscribe({
  dappAddress,
  label,
  buttonLabel,
  successLabel,
  onWalletConnect,
  onOpenMoreOptions,
}: SafeSubscribeProps) {
  const [autoSubscribe, setAutoSubscribe] = useState(false);
  const {
    isSigningMessageState: { get: isSigningMessage },
    isSigningFreeTransactionState: { get: isSigningFreeTransaction },
    connectionInitiatedState: {
      get: isConnectionInitiated,
      set: setConnectionInitiated,
    },
    walletConnected: { get: isWalletConnected },
  } = useDialectWallet();

  const initiateWalletVerification = useCallback(
    () => setConnectionInitiated(true),
    [setConnectionInitiated]
  );

  useEffect(
    function skipNoAuthorizedScreen() {
      // Do not initiate wallet verification if wallet isn't connected or if user hadn't clicked on subscribe
      if (!isWalletConnected || !autoSubscribe) {
        return;
      }
      initiateWalletVerification();
    },
    [isWalletConnected, autoSubscribe, initiateWalletVerification]
  );

  if (!isWalletConnected || isSigningMessage || !isConnectionInitiated) {
    let description = 'Connect wallet...';

    if (isSigningMessage || isSigningFreeTransaction) {
      description = 'Waiting for wallet verification...';
    }

    if (isWalletConnected && !isConnectionInitiated) {
      description = 'Verify wallet...';
    }

    return (
      <SubscribeRow
        label={label}
        successLabel={successLabel}
        buttonLabel={buttonLabel}
        description={description}
        isWalletConnected={isWalletConnected}
        isSubscribed={false}
        isLoading={isSigningMessage}
        onSubscribe={async () => {
          if (!isWalletConnected) {
            onWalletConnect();
          }
          if (isWalletConnected && !isConnectionInitiated) {
            initiateWalletVerification();
          }
          setAutoSubscribe(true);
        }}
      />
    );
  }

  return (
    <ConnectionWrapper>
      {({ errorMessage, isConnected, isLoading }) => {
        if (!isConnected) {
          return (
            <SubscribeRow
              label={label}
              error={errorMessage}
              buttonLabel={buttonLabel}
              successLabel={successLabel}
              description="Waiting for connection..."
              isWalletConnected={isWalletConnected}
              isSubscribed={false}
              isLoading={isLoading}
              onSubscribe={EMPTY_FN}
            />
          );
        }
        return (
          <ConnectedSubscribe
            dappAddress={dappAddress}
            label={label}
            buttonLabel={buttonLabel}
            successLabel={successLabel}
            autoSubscribe={autoSubscribe}
            onOpenMoreOptions={onOpenMoreOptions}
          />
        );
      }}
    </ConnectionWrapper>
  );
}

interface ConnectedSubscribeProps {
  dappAddress: AccountAddress;
  label?: string;
  buttonLabel?: string;
  successLabel?: string;
  autoSubscribe?: boolean;
  onOpenMoreOptions: () => void;
  onSubscribe?: (thread: Thread) => void;
}

function ConnectedSubscribe({
  dappAddress,
  label,
  buttonLabel,
  successLabel,
  autoSubscribe,
  onOpenMoreOptions,
  onSubscribe,
}: ConnectedSubscribeProps): JSX.Element {
  const {
    wallet: { address: walletAddress },
  } = useDialectSdk();

  const { create: createThread, isCreatingThread } = useThreads();

  const [isAutoSubscribed, setAutoSubscribed] = useState(false);
  const [isSubscribing, setSubscribing] = useState(false);

  const {
    globalAddress: walletNotifsAddress,
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
    dappAddress,
  });

  const { thread, isFetchingThread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

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
    onSubscribe?.(thread);
  }, [
    createWalletAddress,
    createWalletThread,
    onSubscribe,
    toggleSubscription,
  ]);

  const handleSubscribe = useCallback(async () => {
    setSubscribing(true);
    // The order of checks is very important, keep it please!

    /* when no address and thread */
    if (!thread && !walletNotifsAddress) {
      await fullEnableWallet();
      setSubscribing(false);
      return;
    }

    /* when address exists but no thread */
    if (!thread && walletNotifsAddress) {
      await createWalletThread();
      setSubscribing(false);
      return;
    }

    /* when thread exists but no address
    Probably this is a *very* old users case */
    if (thread && !walletNotifsAddress) {
      await createWalletAddress();
      setSubscribing(false);
      return;
    }

    if (thread && !subscriptionEnabled) {
      await toggleSubscription({ enabled: true });
      setSubscribing(false);
      return;
    }
  }, [
    createWalletAddress,
    createWalletThread,
    fullEnableWallet,
    subscriptionEnabled,
    thread,
    toggleSubscription,
    walletNotifsAddress,
  ]);

  const isLoading =
    isFetchingThread ||
    isFetchingSubscriptions ||
    isCreatingThread ||
    isDeletingAddress ||
    isCreatingAddress ||
    isToggling;

  // TODO: optimistic UI: show "subscribed" instantly, in case of error — show error
  const isSubscribed = Boolean(
    thread && walletNotifsAddress && subscriptionEnabled
  );

  useEffect(
    function checkForAutoSubscribe() {
      if (!autoSubscribe || isAutoSubscribed || isSubscribed || isLoading)
        return;
      handleSubscribe();
      setAutoSubscribed(true);
    },
    [autoSubscribe, handleSubscribe, isAutoSubscribed, isLoading, isSubscribed]
  );

  return (
    <SubscribeRow
      label={label}
      buttonLabel={buttonLabel}
      successLabel={successLabel}
      isWalletConnected={true}
      description={
        isSubscribing ? 'Subscribing...' : shortenAddress(walletAddress)
      }
      isSubscribed={isSubscribed}
      isLoading={isLoading}
      onOpenMoreOptions={onOpenMoreOptions}
      onSubscribe={handleSubscribe}
    />
  );
}

function InnerSubscribe({
  dialectId,
  dappAddress,
  label,
  buttonLabel,
  successLabel,
  onSubscribe,
  onWalletConnect,
  channels,
}: SubscribeProps) {
  const { open: openModal, close: closeModal } = useDialectUiId(dialectId);

  const refs = useRef<HTMLElement[]>([]);
  useOutsideAlerter(refs, closeModal);

  return (
    <div className="dt-w-full">
      <SafeSubscribe
        dappAddress={dappAddress}
        label={label}
        buttonLabel={buttonLabel}
        successLabel={successLabel}
        onSubscribe={onSubscribe}
        onWalletConnect={onWalletConnect}
        onOpenMoreOptions={openModal}
      />
      <NotificationsModal
        ref={(el) => {
          if (!el) {
            return;
          }
          refs.current[0] = el;
        }}
        standalone
        settingsOnly
        wrapperClassName="!dt-fixed !dt-top-0 !dt-bottom-0 !dt-left-0 !dt-right-0 dt-m-auto dt-text-left"
        dialectId={dialectId}
        channels={channels}
        animationStyle="bottomSlide"
        dappAddress={dappAddress}
      />
    </div>
  );
}

export default function Subscribe(props: SubscribeProps) {
  const { colors } = useTheme();

  return (
    <div className="dialect dt-w-full">
      <div
        className={clsx('dt-flex dt-flex-col dt-h-full', colors.textPrimary)}
      >
        {/* TODO: do not initiate sign until user interaction */}
        {/* TODO: remove ledger toggle for this component */}
        <InnerSubscribe {...props} />
      </div>
    </div>
  );
}
