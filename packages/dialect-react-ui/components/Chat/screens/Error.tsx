import { Centered } from '../../common';
import { useTheme } from '../../common/providers/DialectThemeProvider';
import { Header } from '../../Header';
import { useChatInternal } from '../provider';
import { useDialectUiId } from '../../common/providers/DialectUiManagementProvider';

interface Props {
  type: 'NoConnection' | 'NoWallet';
}

const Error = ({ type }: Props) => {
  const {
    type: chatType,
    onChatOpen,
    onChatClose,
    dialectId,
  } = useChatInternal();
  const { ui } = useDialectUiId(dialectId);
  const { icons } = useTheme();

  if (!type) return null;

  return (
    <>
      <Header
        type={chatType}
        onClose={onChatClose}
        onOpen={onChatOpen}
        onHeaderClick={onChatOpen}
        isWindowOpen={ui?.open}
      >
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
