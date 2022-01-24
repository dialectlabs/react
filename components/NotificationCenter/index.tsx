import React from 'react';
import {
  getDialectForMembers,
  createDialect,
  Member,
} from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { Notification } from './Notification';
import { useApi, WalletType } from '../../api/ApiContext';

const fetchDialectForMembers = async (
  url: string,
  program: anchor.Program,
  pubkey1: string,
  pubkey2: string
) => {
  const member1: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey1),
    scopes: [true, false], //
  };
  const member2: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey2),
    scopes: [true, false], //
  };
  return await getDialectForMembers(
    program,
    [member1, member2],
    anchor.web3.Keypair.generate()
  );
};

const mutateDialectForMembers = async (
  _: string,
  program: anchor.Program,
  pubkey1: string,
  pubkey2: string
) => {
  const member1: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey1),
    scopes: [true, false], //
  };
  const member2: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey2),
    scopes: [true, false], //
  };
  return await createDialect(
    program,
    program.provider.wallet,
    [member1, member2],
  );
};

type PropTypes = {
  wallet: WalletType;
  publicKey: anchor.web3.PublicKey;
};
export default function NotificationCenter(props: PropTypes): JSX.Element {
  const [creating, setCreating] = React.useState(false);
  const { wallet, program } = useApi();

  const { data: dialect, mutate: mutateDialect } = useSWR(
    wallet && program
      ? [
          'dialect',
          program,
          wallet?.publicKey?.toString(),
          props.publicKey.toString(),
        ]
      : null,
    fetchDialectForMembers
  );

  useSWR(
    creating ? [
      'dialect',
      program,
      wallet?.publicKey?.toString(),
      props.publicKey.toString()
    ] : null,
    mutateDialectForMembers,
    {
      onSuccess: (data) => {
        console.log('created dialect', data);
        mutateDialect(data);
        setCreating(false);
      },
      onError: (error) => {
        console.log('error creating dialect', error);
        setCreating(false);
      }
    });

  return (
    <div className="flex flex-col overflow-y-scroll h-full shadow-md py-4 px-6 rounded-lg border bg-white">
      <div className="text-lg font-semibold text-center mb-2">
        Notifications
      </div>
      <div className="h-px" />
      {!wallet ? (
        <div className="h-full flex items-center justify-center">
          <div>Connect your wallet to enable notifications</div>
        </div>
      ) : !dialect ? (
        <div className="flex grow items-center justify-center">
          <button
            className='bg-gray-200 hover:bg-gray-100 disabled:bg-gray-100 px-4 py-2 rounded-full'
            onClick={() => setCreating(true)}
            disabled={creating}
          >
            {creating ? 'Enabling...' : 'Enable notifications'}
          </button>
        </div>
      ) : dialect.dialect.messages.length < 1 ? (
        <div>No notifications yet.</div>
      ) : (
        <>
          {dialect.dialect.messages.map((message) => (
            <Notification
              key={message.timestamp}
              message={message.text}
              timestamp={message.timestamp}
            />
          ))}
        </>
      )}
    </div>
  );
}
