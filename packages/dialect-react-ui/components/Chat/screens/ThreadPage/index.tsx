import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useApi, useDialect } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { P } from '../../../common/preflighted';
import Settings from './Settings';
import Thread from './Thread';
import { DisplayAddress } from '../../../DisplayAddress';
import { Header } from '../../../Header';

interface ThreadPageProps {
  onNewThreadClick?: () => void;
  inbox?: boolean;
  onModalClose?: () => void;
}

const ThreadPage = ({
  inbox,
  onNewThreadClick,
  onModalClose,
}: ThreadPageProps) => {
  const { wallet, program } = useApi();
  const { dialect, dialectAddress, setDialectAddress } = useDialect();
  const { icons, xPaddedText } = useTheme();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const otherMembers = dialect?.dialect.members.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );
  const otherMembersStrs = otherMembers?.map((member) =>
    display(member.publicKey)
  );

  const otherMemberStr = otherMembersStrs?.[0];

  useEffect(
    function resetSettings() {
      setSettingsOpen(false);
    },
    [dialect]
  );

  useEffect(() => {
    setDialectAddress('');
  }, [wallet]);

  if (!dialectAddress) {
    if (!inbox) {
      return null;
    }
    return (
      <div className="dt-hidden md:dt-flex dt-flex-1 dt-justify-center dt-items-center">
        {/* TODO: replace with Button to be sematic */}
        <div
          className="dt-flex dt-cursor-pointer dt-opacity-30"
          onClick={onNewThreadClick}
        >
          <icons.compose className="dt-mr-2" />
          <P>Send a new message</P>
        </div>
      </div>
    );
  }

  return (
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
      <div className="dt-flex dt-flex-col dt-flex-1 dt-min-w-[0px]">
        <Header inbox={inbox} onClose={onModalClose}>
          <Header.Icons containerOnly position="left">
            <Header.Icon
              icon={<icons.back />}
              onClick={() => {
                if (settingsOpen) {
                  setSettingsOpen(false);
                  return;
                }
                setDialectAddress('');
              }}
            />
          </Header.Icons>
          <Header.Title align="center">
            <div className="dt-flex dt-flex-col dt-items-center">
              <span className="dt-text-base dt-font-medium dt-text">
                {dialect && program ? (
                  <DisplayAddress
                    connection={program?.provider.connection}
                    dialectMembers={dialect?.dialect.members}
                    isLinkable={true}
                  />
                ) : (
                  'Loading...'
                )}
              </span>
              {dialect?.dialect.encrypted ? (
                <span className="dt-text-xs dt-opacity-50">encrypted</span>
              ) : (
                <span className="dt-text-xs dt-opacity-50">unencrypted</span>
              )}
            </div>
          </Header.Title>
          <Header.Icons>
            <Header.Icon
              className={clsx({ 'dt-invisible': settingsOpen })}
              icon={<icons.settings />}
              onClick={() => setSettingsOpen((prev) => !prev)}
            />
          </Header.Icons>
        </Header>
        <div
          className={clsx(
            xPaddedText,
            'dt-flex-1 dt-h-full dt-overflow-y-auto'
          )}
        >
          {settingsOpen ? <Settings /> : <Thread />}
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
