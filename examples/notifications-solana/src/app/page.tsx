import { Wallet } from '@/components/wallet';
import { Dialect } from '@/components/dialect';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Wallet />
      <Dialect />
    </main>
  );
}
