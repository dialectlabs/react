import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import Thread from './Thread';
import Settings from './Settings';
import { display } from '@dialectlabs/web3';
import { P } from '../../../../../common/preflighted';
import IconButton from '../../../../../IconButton';

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
  const { dialect, dialectAddress, setDialectAddress } = useDialect();
  const { icons } = useTheme();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  useEffect(
    function resetSettings() {
      setSettingsOpen(false);
    },
    [dialect]
  );

  if (!dialectAddress) {
    if (!inbox) {
      return null;
    }
    return (
      <div className="dt-hidden md:dt-flex dt-flex-1 dt-justify-center dt-items-center">
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
    <div className="dt-flex dt-flex-col dt-flex-1">
      <div className="dt-px-4 dt-py-1 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-items-center">
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
          <span className="dt-text-base dt-font-medium dt-text-white">
            {dialect && display(dialect.dialect.members[1].publicKey)}
          </span>
          {dialect?.dialect.encrypted ? (
            <span className="dt-text-xs dt-opacity-50">encrypted</span>
          ) : (
            <span className="dt-text-xs dt-opacity-50">unencrypted</span>
          )}
        </div>
        <div className="dt-flex">
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
      <div className="dt-flex-1 dt-px-2 dt-overflow-y-scroll">
        {settingsOpen ? <Settings /> : <Thread />}
      </div>
    </div>
  );
};

export default ThreadPage;
