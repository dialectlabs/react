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
    <div className="flex flex-col flex-1">
      <div className="px-4 py-4 mb-2 flex justify-between border-b border-neutral-600 font-bold">
        <div
          className={clsx('cursor-pointer', {
            'md:hidden': !settingsOpen,
          })}
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
          className="cursor-pointer"
          onClick={() => setSettingsOpen((prev) => !prev)}
        >
          <icons.settings />
        </div>
      </div>
      <div className="flex-1 px-2">
        {settingsOpen ? <Settings /> : <Thread />}
      </div>
    </div>
  );
};

export default ThreadPage;
