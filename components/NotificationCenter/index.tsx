import React from 'react';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { useApi, useWallet, getMetadata, createMetadata, getDialectForMembers, Member } from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { Notification } from './Notification';

const fetchMetadata = async (url: string, program: anchor.Program, user: string) => {
  console.log('fetching metadata', url);
  const metadata = await getMetadata(program, new anchor.web3.PublicKey(user));
  return metadata;
};

const mutateMetadata = async (url: string, program: anchor.Program, user: anchor.web3.PublicKey) => {
  const metadata = await createMetadata(program, wallet); // 0.13 vs 0.18 for anchor dep might be the issue with linting here
};

const MOCK_USER_PUBKEY = '92esmqcgpA7CRCYtefHw2J6h7kQHi8q7pP3QmeTCQp8q'; // id-1.json?
// const MOCK_USER_PUBKEY = '6C74KHp9KXDBUMGmoRbedt8xaafyDG8CKqw7qxPXDuEt';
// const MOCK_USER_PUBKEY = 'DRNXnYa12YKy7Bwts9qZ5pR8HTCw7gXcPFtdfHBCZWsS';

const fetchDialectForMembers = async (url: string, program: anchor.Program, pubkey1: string, pubkey2: string) => {
  const member1: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey1),
    scopes: [true, false], // 
  };
  const member2: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey2),
    scopes: [true, false], //
  };
  return await getDialectForMembers(program, [member1, member2], anchor.web3.Keypair.generate());
};

type PropTypes = {
  wallet: AnchorWallet | undefined;
  publicKey: anchor.web3.PublicKey;
}
export default function NotificationCenter(props: PropTypes): JSX.Element {
  const { webWallet } = useWallet();
  const { program } = useApi();
  
  const { data: metadata, error: metadataError } = 
    useSWR(program && webWallet ? ['metadata', program, MOCK_USER_PUBKEY] : null, fetchMetadata);
  const { data: dialect, error: dialectError } = 
    useSWR(webWallet && metadata ? ['dialect', program, MOCK_USER_PUBKEY, props.publicKey.toString()] : null, fetchDialectForMembers);

  return (
    <div
      className='z-50 overflow-y-scroll bg-white h-full shadow-md p-4 rounded-lg border border-gray-100'
    >
      <div className='text-xl'>Notifications</div>
      {!webWallet ? (
        <div className='h-full flex items-center justify-center'>
          <button className='bg-gray-200 hover:bg-gray-100 border border-gray-400 px-4 py-2 rounded-full'>
            {webWallet ? 'Enable notifications' : 'Connect your wallet to enable notifications'}
          </button>
        </div>
      ) : !metadata ? (
        <div>No metadata</div>
      ) : !dialect ? (
        <div>No dialect</div>
      ) : (
        <>
          {dialect.dialect.messages.map((message) => (<Notification key={message.timestamp} title={'title'} message={message.text} timestamp={message.timestamp} />))}
        </>
      )}
    </div>
  );
}
