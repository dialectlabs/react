import { DialectSolanaNotificationsButton } from '@/components/dialect';
import { ThemeSwitch } from '@/components/theme';
import { SolanaWalletButton } from '@/components/wallet';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <header className="flex items-center justify-end gap-3">
        <ThemeSwitch />
        <DialectSolanaNotificationsButton />
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
