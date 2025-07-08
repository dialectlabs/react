import { ExternalChannelType } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { memo } from 'react';
import { ClassTokens } from '../../../theme';
import { EmailChannel, EmailKeyAction } from './EmailChannel';
import { TelegramChannel } from './TelegramChannel';

interface Props {
  channels: ExternalChannelType[];
}

const Channel = ({ type }: { type: ExternalChannelType }) => {
  return (
    <div
      className={clsx(
        'dt-border-b dt-px-3 dt-py-5',
        ClassTokens.Stroke.Primary,
      )}
    >
      {type === 'EMAIL' && (
        <EmailChannel keyAction={<EmailKeyAction.ToggleSubscribe />} />
      )}
      {type === 'TELEGRAM' && <TelegramChannel />}
    </div>
  );
};

export const Channels = memo(function Channels({
  channels: channelTypes,
}: Props) {
  return (
    <div>
      {channelTypes.map((it) => (
        <Channel key={it} type={it} />
      ))}
    </div>
  );
});
