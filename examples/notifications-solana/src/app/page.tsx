'use client';

import { DialectSolanaNotificationsButton } from '@/components/dialect';
import NoSSR from '@/components/NoSSR';
import { getInitialTheme, ThemeSwitch } from '@/components/theme';
import { SolanaWalletButton } from '@/components/wallet';
import { ThemeType } from '@dialectlabs/react-ui';
import { useState } from 'react';

export default function Home() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme());
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <header className="flex items-center justify-end gap-3">
        <NoSSR>
          <ThemeSwitch theme={theme} onThemeChange={setTheme} />
          <DialectSolanaNotificationsButton theme={theme} />
        </NoSSR>
        <SolanaWalletButton />
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
