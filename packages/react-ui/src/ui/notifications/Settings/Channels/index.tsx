import { ExternalChannelType } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { TextButton } from '../../../core';
import { ClassTokens, Icons } from '../../../theme';
import { useExternalProps } from '../../internal/ExternalPropsProvider';
import { TosAndPrivacy } from '../TosAndPrivacy';
import { EmailChannel, EmailKeyAction } from './EmailChannel';
import { TelegramChannel } from './TelegramChannel';

type ChannelsView = 'subscriptions' | 'management';

export const Channels = ({
  renderAdditionalSettingsUi,
}: {
  renderAdditionalSettingsUi?: (args: Record<string, never>) => ReactNode;
}) => {
  const [view, setView] = useState<ChannelsView>('subscriptions');

  return view === 'subscriptions' ? (
    <ChannelSubscriptions
      onManage={() => setView('management')}
      renderAdditionalSettingsUi={renderAdditionalSettingsUi}
    />
  ) : (
    <ChannelManagement onDone={() => setView('subscriptions')} />
  );
};

const Channel = ({
  type,
  activeView,
}: {
  type: ExternalChannelType;
  activeView: ChannelsView;
}) => {
  return (
    <div
      className={clsx(
        'dt-border-b dt-px-3 dt-py-5',
        ClassTokens.Stroke.Primary,
      )}
    >
      {type === 'EMAIL' && (
        <EmailChannel
          keyAction={
            activeView === 'subscriptions' ? (
              <EmailKeyAction.ToggleSubscribe />
            ) : (
              <EmailKeyAction.Unlink />
            )
          }
          allowConnecting={activeView === 'subscriptions'}
        />
      )}
      {type === 'TELEGRAM' && <TelegramChannel />}
    </div>
  );
};

const ChannelSubscriptions = ({
  onManage,
  renderAdditionalSettingsUi,
}: {
  onManage: () => void;
  renderAdditionalSettingsUi?: (args: Record<string, never>) => ReactNode;
}) => {
  const { channels } = useExternalProps();

  return (
    <div>
      <div className="dt-flex dt-items-start dt-px-3">
        <div>
          <h2
            className={clsx('dt-mb-2 dt-text-label', ClassTokens.Text.Primary)}
          >
            Receive alerts everywhere
          </h2>
          <p className={clsx('dt-text-text', ClassTokens.Text.Tertiary)}>
            Get alerts not just in the app, wherever it’s convenient for you:
          </p>
        </div>
        <TextButton onClick={onManage}>
          Manage
          <Icons.ManageChannels />
        </TextButton>
      </div>
      <section>
        {channels.map((it) => (
          <Channel
            key={`${it}-subscription`}
            type={it}
            activeView="subscriptions"
          />
        ))}
      </section>
      {renderAdditionalSettingsUi && (
        <section className="dt-p-3">{renderAdditionalSettingsUi({})}</section>
      )}
      <section className="dt-p-3">
        <TosAndPrivacy />
      </section>
    </div>
  );
};

const ChannelManagement = ({ onDone }: { onDone: () => void }) => {
  const { channels } = useExternalProps();

  return (
    <div>
      <div className="dt-flex dt-items-start dt-px-3 dt-pb-4">
        <div>
          <h2
            className={clsx('dt-mb-2 dt-text-label', ClassTokens.Text.Primary)}
          >
            Manage Channels
          </h2>
          <p className={clsx('dt-text-text', ClassTokens.Text.Tertiary)}>
            Get alerts not just in the app, wherever it’s convenient for you:
          </p>
        </div>
        <TextButton onClick={onDone}>Done</TextButton>
      </div>
      <div className="dt-px-3">
        <div
          role="alert"
          className={clsx(
            'dt-flex dt-gap-2 dt-p-2',
            ClassTokens.Background.WarningTransparent,
            ClassTokens.Radius.Small,
            ClassTokens.Text.Warning,
          )}
        >
          <div>
            <Icons.Warning />
          </div>
          <span className="dt-text-subtext">
            Unlinking this channel will disable notifications from all connected
            sites.
          </span>
        </div>
      </div>
      <section>
        {channels.map((it) => (
          <Channel key={`${it}-management`} type={it} activeView="management" />
        ))}
      </section>
    </div>
  );
};
