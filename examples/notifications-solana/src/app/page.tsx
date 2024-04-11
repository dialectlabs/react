'use client';
import { ThemeSwitch } from '@/components/theme';
import { SolanaWalletButton } from '@/components/wallet';
import { Icons, NotificationTypeStyles } from '@dialectlabs/react-ui';
import { DialectSolanaNotificationsButton } from '@dialectlabs/react-ui-solana';
import '@dialectlabs/react-ui/index.css';
import { PublicKey } from '@solana/web3.js';

NotificationTypeStyles.offer_outbid = {
  Icon: <Icons.Bell width={12} height={12} />,
  iconColor: '#FFFFFF',
  iconBackgroundColor: '#FF0000',
  iconBackgroundBackdropColor: '#FF00001A',
  linkColor: '#FF0000',
  gradientStartColor: '#FF00001A',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <header className="flex items-center justify-end gap-3">
        <ThemeSwitch />
        <DialectSolanaNotificationsButton
          dappAddress={PublicKey.default.toString()}
        />
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
