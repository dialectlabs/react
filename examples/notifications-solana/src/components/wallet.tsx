'use client';
import dynamic from 'next/dynamic';

const WalletIcon = () => (
  <svg width={12} height={14} viewBox="0 0 12 14" fill="none">
    <path
      fill="#fff"
      d="M1.5 1.75h9c.398 0 .75.352.75.75 0 .422-.352.75-.75.75H1.875a.385.385 0 0 0-.375.375c0 .21.164.375.375.375H10.5c.82 0 1.5.68 1.5 1.5v5.25c0 .844-.68 1.5-1.5 1.5h-9a1.48 1.48 0 0 1-1.5-1.5v-7.5c0-.82.656-1.5 1.5-1.5Zm8.25 5.625a.755.755 0 0 0-.75.75c0 .422.328.75.75.75.398 0 .75-.328.75-.75a.771.771 0 0 0-.75-.75Z"
    />
  </svg>
);

const CONNECT_WALLET = (
  <>
    <div className="flex flex-row items-center justify-center gap-3">
      <WalletIcon />
      Connect Wallet
    </div>
  </>
);
const LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting ...',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect',
  'no-wallet': CONNECT_WALLET,
} as const;

const BaseWalletMultiButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
  { ssr: false },
);

export const SolanaWalletButton = () => {
  return (
    <div className={'flex max-h-16 min-h-16 items-center justify-center'}>
      {/*@ts-expect-error labels type*/}
      <BaseWalletMultiButton labels={LABELS} />
    </div>
  );
};
