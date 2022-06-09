import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useApi, useDialect } from '@dialectlabs/react';
import type { DialectAccount } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import { DisplayAddress } from '../../../../../DisplayAddress';
import { useTheme } from '../../../../../common/providers/DialectThemeProvider';
import { P } from '../../../../../common/preflighted';
import IconButton from '../../../../../IconButton';
import Settings from './Settings';
import Thread from './Thread';

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
  const { dialects, dialect, dialectAddress, setDialectAddress } = useDialect();
  const { icons, xPaddedText } = useTheme();

  const publicKey = wallet?.publicKey;
  const prevPublicKey = useRef(publicKey);

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const otherMembers = dialect?.dialect.members.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );
  const otherMembersStrs = otherMembers?.map((member) =>
    display(member.publicKey)
  );

  const dialectFromList = useMemo(
    () =>
      dialects?.find(
        (d: DialectAccount) => d.publicKey.toBase58() === dialectAddress
      ),
    [dialects, dialectAddress]
  );

  const otherMemberStr = otherMembersStrs?.[0];

  useEffect(
    function resetSettings() {
      setSettingsOpen(false);
    },
    [dialect]
  );

  useEffect(() => {
    if (publicKey == prevPublicKey.current) return;
    setDialectAddress('');
    prevPublicKey.current = publicKey;
  }, [publicKey]);

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

  const threadType = dialect?.dialect.encrypted ? 'encrypted' : 'unencrypted';

  return (
    <div className="dt-flex dt-flex-col dt-flex-1 dt-min-w-[0px]">
      {/* ↑ The min-width: 0 is used to prevent the column from overflow the container. Explanation: https://makandracards.com/makandra/66994-css-flex-and-min-width */}
      <div className="dt-px-4 dt-py-1 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-items-center">
        {/* TODO: replace with IconButton to be sematic */}
        <div
          className={clsx('dt-cursor-pointer')}
          onClick={() => {
            if (settingsOpen) {
              setSettingsOpen(false);
              return;
            }
            setDialectAddress('');
          }}
        >
          <icons.back />
        </div>
        <div className="dt-flex dt-flex-col dt-items-center">
          <span className="dt-text-base dt-font-medium dt-text">
            {dialectFromList ? (
              <DisplayAddress
                connection={program?.provider.connection}
                dialectMembers={dialectFromList?.dialect.members}
                isLinkable={true}
              />
            ) : (
              'Loading thread...'
            )}
          </span>
          {dialect ? (
            <span className="dt-text-xs dt-opacity-50">{threadType}</span>
          ) : (
            <span className="dt-text-xs dt-opacity-50">Loading thread...</span>
          )}
        </div>
        <div className="dt-flex">
          {/* TODO: replace with IconButton to be sematic */}
          <div
            className={clsx('dt-cursor-pointer', {
              'dt-invisible': settingsOpen,
            })}
            onClick={() => setSettingsOpen((prev) => !prev)}
          >
            <icons.settings />
          </div>
          {!inbox && onModalClose && (
            <div className="sm:dt-hidden dt-ml-3">
              <IconButton icon={<icons.x />} onClick={onModalClose} />
            </div>
          )}
        </div>
      </div>
      <div className={clsx(xPaddedText, 'dt-flex-1 dt-overflow-y-auto')}>
        {settingsOpen ? <Settings /> : <Thread />}
      </div>
    </div>
  );
};

export default ThreadPage;
