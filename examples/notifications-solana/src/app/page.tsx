'use client';

import { DialectSolanaNotificationsButton } from '@/components/dialect';
import NoSSR from '@/components/NoSSR';
import { getInitialTheme, ThemeSwitch } from '@/components/theme';
import { SolanaWalletButton } from '@/components/wallet';
import { BookIcon } from '@/icons/BookIcon';
import { GitHubIcon } from '@/icons/GitHubIcon';
import { ThemeType } from '@dialectlabs/react-ui';
import { useState } from 'react';

export default function Home() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme());
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <header className="flex items-center justify-between gap-3">
        <NoSSR>
          <div className="flex items-center gap-4 md:gap-6">
            <a
              className="text-button flex items-center justify-center gap-1.5 font-semibold hover:opacity-80"
              href="https://docs.dialect.to/documentation/notifications-quick-start"
              target="_blank"
              rel="noreferrer"
            >
              <BookIcon />
              Read our Docs
            </a>
            <a
              className="text-button flex items-center justify-center gap-1.5 font-semibold hover:opacity-80"
              href="https://github.com/dialectlabs/react/tree/master/examples/notifications-solana"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon />
              View the Code
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitch theme={theme} onThemeChange={setTheme} />
            <DialectSolanaNotificationsButton theme={theme} />
            <SolanaWalletButton />
          </div>
        </NoSSR>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[15px] text-[#888989]">@dialectlabs/react</p>
          <p className="text-2xl font-bold">examples/notifications-solana</p>
        </div>
        <SolanaWalletButton />
      </main>
    </div>
  );
}
