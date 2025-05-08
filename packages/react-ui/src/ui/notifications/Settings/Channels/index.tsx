import { memo } from 'react';
import { ChannelType } from '../../../../types';
import { EmailChannel } from './EmailChannel';
import { TelegramChannel } from './TelegramChannel';

interface Props {
  channels: ChannelType[];
}

const Channel = ({ type }: { type: ChannelType }) => {
  return (
    <div className="dt-py-2">
      {type === 'email' && <EmailChannel />}
      {type === 'telegram' && <TelegramChannel />}
    </div>
  );
};

export const Channels = memo(function Channels({ channels }: Props) {
  return (
    <div>
      {channels.map((it) => (
        <Channel key={it} type={it} />
      ))}
    </div>
  );
});
