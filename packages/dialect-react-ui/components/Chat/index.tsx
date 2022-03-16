import React, { useCallback, useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { Centered, Divider, Footer } from '../common';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';
import MessagePreview from './MessagePreview';
import CreateThread from './CreateThread';
import Header from './Header';
import Thread from './Thread';
import ThreadSettings from './ThreadSettings';

export default function Chat(): JSX.Element {
  const {
    disconnectedFromChain,
    isWalletConnected,
    dialectAddress,
    dialects,
    setDialectAddress,
  } = useDialect();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isNoSubscriptions, setIsNoSubscriptions] = useState(false);

  useEffect(() => {
    setSubscriptions(dialects || []);
    setIsNoSubscriptions(dialects.length < 1);
  }, [dialects]);

  const toggleCreate = useCallback(
    () => setCreateOpen(!isCreateOpen),
    [isCreateOpen, setCreateOpen]
  );

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  const { colors, modal, icons } = useTheme();

  let content: JSX.Element;

  if (disconnectedFromChain) {
    content = (
      <Centered>
        <icons.offline className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Lost connection to Solana blockchain</span>
      </Centered>
    );
  } else if (!isWalletConnected) {
    content = (
      <Centered>
        <icons.notConnected className="mb-6 opacity-60" />
        <span className="opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (isCreateOpen) {
    content = <CreateThread toggleCreate={toggleCreate} />;
  } else if (isSettingsOpen) {
    content = <ThreadSettings toggleSettings={toggleSettings} />;
  } else if (isNoSubscriptions) {
    content = (
      <Centered>
        <span className="opacity-60">No messages yet</span>
      </Centered>
    );
  } else if (dialectAddress) {
    content = <Thread />;
  } else {
    content = (
      <div className="flex flex-col space-y-2">
        {subscriptions.map((subscription: any) => (
          <MessagePreview
            key={subscription.publicKey.toBase58()}
            dialect={subscription}
            onClick={() => {
              console.log(
                'setting dialect address',
                subscription.publicKey.toBase58()
              );
              setDialectAddress(subscription.publicKey.toBase58());
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="dialect h-full">
      <div
        className={cs(
          'flex flex-col h-full shadow-md overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <Header
          isReady={isWalletConnected}
          isCreateOpen={isCreateOpen}
          toggleCreate={toggleCreate}
          isSettingsOpen={isSettingsOpen}
          toggleSettings={toggleSettings}
        />
        <Divider className="mx-2" />
        <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
        <Footer
          showBackground={Boolean(dialects?.length && dialects?.length > 4)}
        />
      </div>
    </div>
  );
}
