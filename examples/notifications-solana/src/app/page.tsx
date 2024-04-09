import { SolanaWalletButton } from '@/components/wallet';
import { DialectSolanaNotificationsButton } from '@dialectlabs/react-ui-solana';
import '@dialectlabs/react-ui/index.css';
import { PublicKey } from '@solana/web3.js';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <header className="flex items-center justify-end gap-3">
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
