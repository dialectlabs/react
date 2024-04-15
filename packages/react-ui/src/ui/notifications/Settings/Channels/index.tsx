import { memo } from 'react';
import { ChannelType } from '../../../../types';
import { EmailChannel } from './EmailChannel';
import { TelegramChannel } from './TelegramChannel';
import { WalletChannel } from './WalletChannel';

interface Props {
  channels: ChannelType[];
}

const Channel = ({ type }: { type: ChannelType }) => {
  const ChannelRow = () => {
    if (type === 'email') return <EmailChannel />;
    if (type === 'telegram') return <TelegramChannel />;
    return <WalletChannel />;
  };
  return (
    <div className="dt-py-2">
      <ChannelRow />
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
