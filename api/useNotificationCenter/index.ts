import React from 'react';
import NotificationCenterPropTypes from '../../components/NotificationCenter';
import { getDialectForMembers, createDialect, Member } from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { useApi, WalletType } from '../../api/ApiContext';

interface Message {
  timestamp: number;
  text: string;
}

type NotificationCenterObject = {
  isWalletConnected: boolean;
  isDialectAvailable: boolean;
  isDialeactCreating: boolean;
  createDialect: () => void;
  isEmpty: boolean;
  messages: Message[];
};

type NotificationCenterPropTypes = {
  wallet: WalletType;
  publicKey: anchor.web3.PublicKey;
};

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
  return await createDialect(program, program.provider.wallet, [
    member1,
    member2,
  ]);
};

export default function useNotificationCenter(
  props: NotificationCenterPropTypes
): NotificationCenterObject {
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
    creating
      ? [
          'dialect',
          program,
          wallet?.publicKey?.toString(),
          props.publicKey.toString(),
        ]
      : null,
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
      },
    }
  );

  const isWalletConnected = Boolean(wallet);
  const isDialectAvailable = Boolean(dialect);

  return {
    isWalletConnected,
    isDialectAvailable,
    isEmpty: wallet && dialect ? dialect.dialect.messages.length === 0 : true,
    messages: wallet && dialect ? dialect.dialect.messages : [],
    isDialeactCreating: creating,
    createDialect: () => setCreating(true),
  };
}

export type { NotificationCenterPropTypes };
