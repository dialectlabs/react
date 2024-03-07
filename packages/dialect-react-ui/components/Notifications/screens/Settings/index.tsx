import {
  AccountAddress,
  Thread,
  useNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useCallback } from 'react';
import type { RemoteNotificationExtension, NotificationType } from '../..';
import { Divider, Footer, Toggle, ValueRow } from '../../../common';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import type { Channel } from '../../../common/types';
import { RouteName } from '../../constants';
import Email from '../NewSettings/Email';
import Telegram from '../NewSettings/Telegram';
import Wallet from '../NewSettings/Wallet';

interface LocalRenderNotificationTypeParams {
  name: string;
  detail?: string;
  id?: string;
  enabled?: boolean;
  type: 'local';
  onToggle?: unknown;
  renderAdditional?: () => ReactNode;
}

interface RemoteRenderNotificationTypeParams {
  name: string;
  detail?: string;
  id?: string;
  enabled?: boolean;
  type: 'remote';
  onToggle?: (value: boolean) => void;
  renderAdditional?: (state: boolean) => ReactNode;
}

type RenderNotificationTypeParams =
  | LocalRenderNotificationTypeParams
  | RemoteRenderNotificationTypeParams;

interface SettingsProps {
  dappAddress: AccountAddress;
  channels: Channel[];
  notifications?: NotificationType[];
  remoteNotificationExtensions?: RemoteNotificationExtension[];
}

export const NotificationToggle = ({
  id,
  name,
  detail,
  enabled = true,
  onToggle,
  type,
  renderAdditional,
}: RenderNotificationTypeParams) => {
  const { highlighted, colors, textStyles } = useTheme();
  return (
    <div className={clsx(highlighted, 'dt-mb-2', colors.highlight)}>
      <div className="dt-flex dt-justify-between">
        <span className={clsx(textStyles.body)}>{name}</span>
        {type !== 'local' && (
          <Toggle
            key={id || name}
            checked={enabled}
            toggleSize="S"
            onChange={onToggle}
          />
        )}
      </div>

      {detail && (
        <P className={clsx(textStyles.small, 'dt-mb-1 dt-mt-1 dt-opacity-60')}>
          {detail}
        </P>
      )}

      {renderAdditional &&
        (type === 'remote' ? renderAdditional(enabled) : renderAdditional())}
    </div>
  );
};

function Settings({
  dappAddress,
  channels,
  notifications: notificationsTypes,
  remoteNotificationExtensions,
}: SettingsProps) {
  const { textStyles, notificationsSettingsWrapper, xPaddedText, colors } =
    useTheme();
  const {
    subscriptions: notificationSubscriptions,
    update: updateNotificationSubscription,
    isUpdating,
    errorUpdating: errorUpdatingNotificationSubscription,
    errorFetching: errorFetchingNotificationsConfigs,
  } = useNotificationSubscriptions({ dappAddress });

  const { navigate } = useRoute();

  const error =
    errorFetchingNotificationsConfigs || errorUpdatingNotificationSubscription;

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

  return (
    <div className={notificationsSettingsWrapper}>
      <div>
        <div
          className={clsx(
            'dialect-settings-channels',
            'dt-flex dt-flex-col dt-pt-4 dt-pb-2'
          )}
        >
          {channels.map((channelSlug) => {
            let form;
            if (channelSlug === 'web3') {
              form = (
                <Wallet
                  dappAddress={dappAddress}
                  onThreadCreated={showThread}
                />
              );
            } else if (channelSlug === 'email') {
              form = <Email dappAddress={dappAddress} />;
            } else if (channelSlug === 'telegram') {
              form = <Telegram dappAddress={dappAddress} />;
            }
            return (
              <div key={channelSlug} className="dt-mb-2">
                {form}
              </div>
            );
          })}
        </div>
        <div className="dt-mt-2 dt-mb-6">
          <Divider />
        </div>
        <div className={'dialect-settings-topics'}>
          {error && !notificationsTypes ? (
            <ValueRow
              label={<P className={clsx(colors.error)}>{error.message}</P>}
            >
              {''}
            </ValueRow>
          ) : null}
          {notificationSubscriptions.length || notificationsTypes?.length ? (
            <>
              {notificationSubscriptions.map(
                ({ notificationType, subscription }) => (
                  <NotificationToggle
                    key={notificationType.id}
                    id={notificationType.id}
                    name={notificationType.name}
                    enabled={subscription.config.enabled}
                    type="remote"
                    detail={notificationType.trigger}
                    renderAdditional={
                      remoteNotificationExtensions?.find(
                        (ext) =>
                          ext.humanReadableId ===
                          notificationType.humanReadableId
                      )?.renderAdditional
                    }
                    onToggle={(value) => {
                      if (isUpdating) return;
                      updateNotificationSubscription({
                        notificationTypeId: notificationType.id,
                        config: {
                          ...subscription.config,
                          enabled: value,
                        },
                      });
                    }}
                  />
                )
              )}
              {/* Render manually passed types in case api doesn't return anything */}
              {!notificationSubscriptions.length &&
                notificationsTypes?.map((notificationType, idx) => (
                  <NotificationToggle
                    key={idx}
                    {...notificationType}
                    type="local"
                  />
                ))}
            </>
          ) : null}
        </div>
      </div>
      <div className={clsx('dialect-settings-footer', 'dt-mt-2')}>
        <P
          className={clsx(
            textStyles.tos,
            xPaddedText,
            'dt-opacity-50 dt-text-center'
          )}
        >
          By enabling notifications you agree to Dialect&apos;s{' '}
          <A
            className="dt-underline"
            target="_blank"
            rel="noreferrer"
            href="https://www.dialect.to/tos"
          >
            Terms of Service
          </A>{' '}
          and{' '}
          <A
            className="dt-underline"
            target="_blank"
            rel="noreferrer"
            href="https://www.dialect.to/privacy"
          >
            Privacy Policy
          </A>
        </P>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Settings;
