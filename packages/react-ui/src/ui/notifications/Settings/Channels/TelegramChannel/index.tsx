import {
  TelegramPrepareResponse,
  useChannels,
  useConnectTelegram,
  useSubscribe,
  useUnsubscribe,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { Button, ButtonType } from '../../../../core';
import { Label } from '../../../../core/primitives/Label';
import { ClassTokens, Icons } from '../../../../theme';

const CHANNELS_POLLING_INTERVAL_MS = 5 * 1000; // 5 seconds

const formatTelegramHandle = (handle?: string) => `@${handle || ''}`;

export const TelegramChannel = ({
  allowConnecting = true,
  keyAction,
}: {
  allowConnecting?: boolean;
  keyAction?: ReactNode; // component to render if the connection reached a terminal state (if either connected and verified, or allowedConnecting = false)
}) => {
  const [prepareResponse, setPrepareResponse] =
    useState<TelegramPrepareResponse | null>(null);

  const { channels, refresh } = useChannels({
    type: 'TELEGRAM',
    refreshInterval: prepareResponse ? CHANNELS_POLLING_INTERVAL_MS : undefined,
  });
  const channel = channels?.TELEGRAM;

  const { prepare, isPreparing } = useConnectTelegram();
  const { subscribe } = useSubscribe({ channel: 'TELEGRAM' });

  const isTelegramConnected = !!channel?.value && channel?.verified;

  const handlePrepare = async () => {
    try {
      const prepareResponse = await prepare();
      await refresh({
        TELEGRAM: {
          id: 'optimistic-id',
          type: 'TELEGRAM',
          value: '',
          verified: false,
          subscribed: false,
        },
      });

      setPrepareResponse(prepareResponse);

      window.open(prepareResponse.verification.link);
    } catch (error) {
      // noop
    }
  };

  useEffect(() => {
    // best-effort way to subscribe the user to notifications, once polling returned verified - subscribe
    if (
      prepareResponse?.subscribed === false &&
      channel?.verified === true &&
      !channel.subscribed
    ) {
      setPrepareResponse(null);
      subscribe().then(() =>
        refresh({
          TELEGRAM: {
            ...channel,
            verified: true,
            subscribed: true,
          },
        }),
      );
    }
    // ignoring subscribe
    // eslint-disable-next-line
  }, [channel?.verified, prepareResponse?.subscribed, channel?.subscribed]);

  if (!allowConnecting) {
    return (
      <div className="dt-flex dt-items-center dt-justify-between">
        <TelegramLabel
          telegram={
            channel?.value
              ? formatTelegramHandle(channel?.value)
              : 'No Telegram handle linked to your wallet.'
          }
        />
        {keyAction}
      </div>
    );
  }

  if (isTelegramConnected) {
    return (
      <div className="dt-flex dt-items-center dt-justify-between">
        <TelegramLabel telegram={formatTelegramHandle(channel?.value)} />
        {keyAction}
      </div>
    );
  }

  // subscribe pressed, waiting for verification, showing link to verify
  // if user has connected before, but left this view, they would be asked to restart
  if (prepareResponse) {
    return (
      <div className="dt-flex dt-items-center dt-justify-between">
        <TelegramLabel telegram="Waiting for verification..." />
        <div>
          <Button
            href={prepareResponse.verification.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify
          </Button>
        </div>
      </div>
    );
  }

  // no connection
  return (
    <div className="dt-flex dt-items-center dt-justify-between">
      <TelegramLabel />
      <div>
        {/* technically calls prepare */}
        <Button onClick={handlePrepare} loading={isPreparing}>
          Subscribe
        </Button>
      </div>
    </div>
  );
};

export const TelegramKeyAction = {
  ToggleSubscribe: () => {
    const {
      isLoading: isChannelsLoading,
      channels,
      refresh,
    } = useChannels({ type: 'TELEGRAM' });
    const { subscribe, isLoading: isSubscribing } = useSubscribe({
      channel: 'TELEGRAM',
    });
    const { unsubscribe, isLoading: isUnsubscribing } = useUnsubscribe({
      channel: 'TELEGRAM',
    });

    const isTelegramSubscribed = channels?.TELEGRAM?.subscribed === true;

    const handleSubscribe = async () => {
      try {
        await subscribe();
        await refresh({
          TELEGRAM: {
            ...channels.TELEGRAM!,
            subscribed: true,
          },
        });
      } catch {
        // noop
      }
    };

    const handleUnsubscribe = async () => {
      try {
        await unsubscribe();
        await refresh({
          TELEGRAM: {
            ...channels.TELEGRAM!,
            subscribed: false,
          },
        });
      } catch {
        // noop
      }
    };

    if (isChannelsLoading) {
      return <Button loading={true} />;
    }

    return isTelegramSubscribed ? (
      <Button loading={isUnsubscribing} onClick={handleUnsubscribe}>
        Unsubscribe
      </Button>
    ) : (
      <Button loading={isSubscribing} onClick={handleSubscribe}>
        Subscribe
      </Button>
    );
  },
  Unlink: () => {
    const {
      channels,
      isLoading: isChannelsLoading,
      refresh,
    } = useChannels({ type: 'TELEGRAM' });
    const { unlink, isUnlinking } = useConnectTelegram();

    const isTelegramPresent = channels?.TELEGRAM;

    const handleUnlink = async () => {
      try {
        await unlink();
        await refresh({ TELEGRAM: undefined });
      } catch {
        // noop
      }
    };

    if (!isTelegramPresent) {
      return null;
    }

    return (
      <Button
        type={ButtonType.Destructive}
        loading={isUnlinking || isChannelsLoading}
        onClick={handleUnlink}
      >
        Unlink
      </Button>
    );
  },
};

const TelegramLabel = ({ telegram }: { telegram?: string }) => {
  return (
    <Label className="dt-inline-flex dt-items-center dt-gap-2">
      <Icons.Telegram />
      <div className="dt-flex dt-flex-col dt-gap-0.5">
        <span>Telegram</span>
        {telegram && (
          <span className={clsx('dt-text-subtext', ClassTokens.Text.Tertiary)}>
            {telegram}
          </span>
        )}
      </div>
    </Label>
  );
};
