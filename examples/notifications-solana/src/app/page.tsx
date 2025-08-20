'use client';

import { Card } from '@/components/Card';
import { DialectSolanaNotificationsButton } from '@/components/dialect';
import NoSSR from '@/components/NoSSR';
import { getInitialTheme, ThemeSwitch } from '@/components/theme';
import { SolanaWalletButton } from '@/components/wallet';
import { BookIcon } from '@/icons/BookIcon';
import { GitHubIcon } from '@/icons/GitHubIcon';
import { ThemeType } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const DAPP_ADDRESS =
  process.env.NEXT_PUBLIC_DAPP_ADDRESS ??
  'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h';

export default function Home() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme());
  const searchParams = useSearchParams();
  const { connected } = useWallet();

  const dappAddress = searchParams.get('dappAddress');
  const currentDappAddress = dappAddress ?? DAPP_ADDRESS;

  const [inputDappAddress, setInputDappAddress] = useState(currentDappAddress);
  const hasChanged = inputDappAddress !== currentDappAddress;

  const handleUpdate = () => {
    const url = new URL(window.location.href);
    if (inputDappAddress === DAPP_ADDRESS) {
      url.searchParams.delete('dappAddress');
    } else {
      url.searchParams.set('dappAddress', inputDappAddress);
    }
    window.location.href = url.toString();
  };

  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <header className="flex items-center justify-between gap-3">
        <NoSSR>
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="https://dialect.to"
              className="flex items-center hover:opacity-80 transition-opacity"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://res.cloudinary.com/dnxjhra4h/image/upload/v1750416393/dialect-docs/logo-light.svg"
                alt="Dialect Logo"
                className="h-8 w-auto"
                style={{
                  filter: theme === 'dark' ? 'brightness(0) saturate(100%) invert(1)' : 'none'
                }}
              />
            </a>
            <a
              className="text-button flex items-center justify-center gap-1.5 font-semibold hover:opacity-80"
              href="https://docs.dialect.to/alerts"
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
            <DialectSolanaNotificationsButton
              theme={theme}
              dappAddress={dappAddress}
            />
            <SolanaWalletButton />
          </div>
        </NoSSR>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-6 text-center w-full max-w-2xl">
          <h1 className="text-3xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#1b1b1c' }}>Test Dialect Alerts</h1>
          <p className="text-sm text-dark-20 dark:text-light-40">This is a simple app to test Dialect&apos;s alerts stack. Please follow the steps below.</p>
        </div>
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {/* Step 1: Connect wallet */}
          <Card>
            <h3 className="font-medium mb-3" style={{ color: theme === 'dark' ? '#ffffff' : '#1b1b1c' }}>Step 1: Connect your wallet</h3>
            <p className="text-sm text-dark-20 dark:text-light-40 mb-4">First, connect your wallet to receive alerts from your application.</p>
            {!connected ? (
              <SolanaWalletButton />
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-dark-20 dark:text-light-40">Wallet connected</span>
              </div>
            )}
          </Card>

          {/* Step 2: Check connection - only show when wallet is connected */}
          {connected && (
            <Card>
              <h3 className="font-medium mb-3" style={{ color: theme === 'dark' ? '#ffffff' : '#1b1b1c' }}>Step 2: Specify your project</h3>
              <p className="text-sm text-dark-20 dark:text-light-40 mb-4">Add your project&apos;s <a href="https://dashboard.dialect.to/api-keys" style={{ textDecoration: 'underline' }}>wallet address</a> here or as a query parameter in the URL.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputDappAddress}
                  onChange={(e) => setInputDappAddress(e.target.value)}
                  className="flex-1 px-3 py-2 border border-light-60 dark:border-dark-40 rounded-md bg-primary dark:bg-dark-100 text-dark-100 dark:text-light-100 font-mono text-sm focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan"
                  placeholder="Enter wallet address"
                />
                <button
                  onClick={handleUpdate}
                  disabled={!hasChanged}
                  className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 ${hasChanged
                    ? 'bg-dark-100 hover:bg-dark-80 dark:bg-accent-cyan dark:hover:bg-accent-cyan/80 text-light-100 shadow-sm hover:shadow-md cursor-pointer'
                    : 'bg-light-50 dark:bg-dark-60 text-dark-40 dark:text-light-40 cursor-not-allowed'
                    }`}
                >
                  Update
                </button>
              </div>
            </Card>
          )}

          {/* Step 3: Check notifications - only show when wallet is connected */}
          {connected && (
            <Card>
              <h3 className="font-medium mb-3" style={{ color: theme === 'dark' ? '#ffffff' : '#1b1b1c' }}>Step 3: Try it out</h3>
              <p className="text-sm text-dark-20 dark:text-light-40">You&apos;re good to go! Click the notification bell icon to get subscribed to see your alerts.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
