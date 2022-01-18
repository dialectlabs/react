import React from 'react';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { useApi, useWallet, getMetadata, createMetadata } from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';

const fetchMetadata = async (url: string, program: anchor.Program, user: anchor.web3.PublicKey) => {
  console.log('fetching metadata', url);
  const metadata = await getMetadata(program, user);
  return metadata;
};

const mutateMetadata = async (url: string, program: anchor.Program, user: anchor.web3.PublicKey) => {
};

type PropTypes = {
  wallet: AnchorWallet | undefined;
}
export default function NotificationCenter(props: PropTypes): JSX.Element {
  const { webWallet } = useWallet();
  const { program } = useApi();
  
  console.log('program', program);
  const { data: metadata, error } = useSWR(
    program && webWallet ? ['metadata', program, new anchor.web3.PublicKey('92esmqcgpA7CRCYtefHw2J6h7kQHi8q7pP3QmeTCQp8q')] : null, fetchMetadata);
  console.log('metadata', metadata);
  console.log('error', error);
  return (
    <div
      className='z-1000 bg-white h-full shadow-md p-4 rounded-lg border border-gray-100'
    >
      <div className='text-xl'>Notifications</div>
      <div className='h-full flex items-center justify-center'>
        <button className='bg-gray-200 hover:bg-gray-100 border border-gray-400 px-4 py-2 rounded-full'>
          {webWallet ? 'Enable notifications' : 'Connect your wallet to enable notifications'}
        </button>
      </div>
    </div>
  );
}
