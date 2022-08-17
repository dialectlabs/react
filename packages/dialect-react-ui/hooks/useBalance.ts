import { useDialectSdk } from '@dialectlabs/react-sdk';
import { ownerFetcher } from '@dialectlabs/web3';
import useSWR from 'swr';

export default function useBalance() {
  const {
    info: {
      wallet,
      solana: { dialectProgram },
    },
  } = useDialectSdk();

  const { data, error } = useSWR(
    dialectProgram?.provider.connection && wallet
      ? ['/owner', wallet, dialectProgram?.provider.connection]
      : null,
    ownerFetcher
  );
  const balance = data?.lamports ? (data.lamports / 1e9).toFixed(2) : null;

  return { balance, error };
}
