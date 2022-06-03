import { Centered } from '../../common';
import { useTheme } from '../../common/providers/DialectThemeProvider';
import { Header } from '../../Header';

interface Props {
  type: 'NoConnection' | 'NoWallet';
  inbox?: boolean;
  onChatClose?: () => void;
  onChatOpen?: () => void;
}

const Error = ({ inbox, type, onChatClose, onChatOpen }: Props) => {
  const { icons } = useTheme();

  if (!type) return null;

  return (
    <>
      <Header inbox={inbox} onClose={onChatClose} onHeaderClick={onChatOpen}>
        <Header.Title>Messages</Header.Title>
        <Header.Icons />
      </Header>
      {type === 'NoConnection' && (
        <Centered>
          <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
          <span className="dt-opacity-60">
            Lost connection to Solana blockchain
          </span>
        </Centered>
      )}
      {type === 'NoWallet' && (
        <Centered>
          <icons.notConnected className="dt-mb-6 dt-opacity-60" />
          <span className="dt-opacity-60">Wallet not connected</span>
        </Centered>
      )}
    </>
  );
};

export default Error;
