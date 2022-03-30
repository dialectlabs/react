import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import Thread from './Thread';
import Settings from './Settings';
import { display } from '@dialectlabs/web3';
import { P } from '../../../../../common/preflighted';

interface ThreadPageProps {
  inbox?: boolean;
}

const ThreadPage = ({ inbox }: ThreadPageProps) => {
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
      <div className="dt-flex dt-flex-1 dt-justify-center dt-items-center">
        <P>Select a chat to start messaging</P>
      </div>
    );
  }

  return (
    <div className="dt-flex dt-flex-col dt-flex-1">
      <div className="dt-px-4 dt-py-4 dt-mb-2 dt-flex dt-justify-between dt-border-b dt-border-neutral-600 dt-font-bold dt-items-center">
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
          {dialect && display(dialect.dialect.members[1].publicKey)}
          {dialect?.dialect.encrypted ? (
            <span className="dt-text-xs dt-opacity-50">encrypted</span>
          ) : (
            <span className="dt-text-xs dt-opacity-50">unencrypted</span>
          )}
        </div>
        <div
          className={clsx('dt-cursor-pointer', {
            'dt-invisible': settingsOpen,
          })}
          onClick={() => setSettingsOpen((prev) => !prev)}
        >
          <icons.settings />
        </div>
      </div>
      <div className="dt-flex-1 dt-px-2 dt-overflow-y-scroll">
        {settingsOpen ? <Settings /> : <Thread />}
      </div>
    </div>
  );
};

export default ThreadPage;
