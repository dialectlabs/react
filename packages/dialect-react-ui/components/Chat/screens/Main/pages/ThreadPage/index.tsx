import clsx from 'clsx';
import React, { useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import Thread from './Thread';
import Settings from './Settings';
import { display } from '@dialectlabs/web3';

const ThreadPage = () => {
  const { dialect, dialectAddress, setDialectAddress } = useDialect();
  const { icons } = useTheme();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  if (!dialectAddress) return null;

  return (
    <div className="dt-flex dt-flex-col dt-flex-1">
      <div className="dt-px-4 dt-py-4 dt-mb-2 dt-flex dt-justify-between dt-border-b dt-border-neutral-600 dt-font-bold">
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
        {dialect ? display(dialect.dialect.members[1].publicKey) : 'null'}
        <div
          className="dt-cursor-pointer"
          onClick={() => setSettingsOpen((prev) => !prev)}
        >
          <icons.settings />
        </div>
      </div>
      <div className="dt-flex-1 dt-px-2">
        {settingsOpen ? <Settings /> : <Thread />}
      </div>
    </div>
  );
};

export default ThreadPage;
