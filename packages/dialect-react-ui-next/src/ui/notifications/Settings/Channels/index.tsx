import { ChannelType } from '@dialectlabs/react-sdk';
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

export const Channels = ({ channels }: Props) => {
  return (
    <div className="dt-pb-2 dt-pt-3">
      {channels.map((it) => (
        <Channel key={it} type={it} />
      ))}
    </div>
  );
};
