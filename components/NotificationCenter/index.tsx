import React from 'react';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import {
  useApi,
  useWallet,
  getMetadata,
  createMetadata,
  getDialectForMembers,
  Member,
} from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { Notification } from './Notification';

const fetchMetadata = async (
  url: string,
  program: anchor.Program,
  user: string
) => {
  console.log('fetching metadata', url);
  const metadata = await getMetadata(program, new anchor.web3.PublicKey(user));
  return metadata;
};

const mutateMetadata = async (
  url: string,
  program: anchor.Program,
  user: anchor.web3.PublicKey
) => {
  const metadata = await createMetadata(program, wallet); // 0.13 vs 0.18 for anchor dep might be the issue with linting here
};

const MOCK_USER_PUBKEY = '92esmqcgpA7CRCYtefHw2J6h7kQHi8q7pP3QmeTCQp8q'; // id-1.json?
// const MOCK_USER_PUBKEY = '6C74KHp9KXDBUMGmoRbedt8xaafyDG8CKqw7qxPXDuEt';
// const MOCK_USER_PUBKEY = 'DRNXnYa12YKy7Bwts9qZ5pR8HTCw7gXcPFtdfHBCZWsS';

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

const MESSAGES_MOCK = [
  {
    owner: new anchor.web3.PublicKey(
      '92esmqcgpA7CRCYtefHw2J6h7kQHi8q7pP3QmeTCQp8q'
    ),
    text: 'Hey, your Collateralization Ratio is quite hight',
    timestamp: 1642703782810,
  },
];

type PropTypes = {
  wallet: AnchorWallet | undefined;
  publicKey: anchor.web3.PublicKey;
};
export default function NotificationCenter(props: PropTypes): JSX.Element {
  const { webWallet } = useWallet();
  const { program } = useApi();

  const { data: metadata, error: metadataError } = useSWR(
    program && webWallet
      ? ['metadata', program, webWallet.publicKey.toString()]
      : null,
    fetchMetadata
  );
  const { data: dialect, error: dialectError } = useSWR(
    webWallet && program
      ? [
          'dialect',
          program,
          webWallet.publicKey.toString(),
          props.publicKey.toString(),
        ]
      : null,
    fetchDialectForMembers
  );

  return (
    <div className="overflow-y-scroll bg-th-bkg-1 h-full shadow-md py-4 px-6 rounded-lg border border-th-bkg-2">
      <div className="text-lg font-semibold text-center mb-2">
        Notifications
      </div>
      <div className="h-px bg-th-bkg-4" />
      {!webWallet ? (
        <div className="h-full flex items-center justify-center">
          <button className="bg-gray-200 hover:bg-gray-100 border border-gray-400 px-4 py-2 rounded-full">
            {webWallet
              ? 'Enable notifications'
              : 'Connect your wallet to enable notifications'}
          </button>
        </div>
      ) : !metadata ? (
        <div>No metadata</div>
      ) : !dialect ? (
        <div>No dialect</div>
      ) : (
        <>
          {MESSAGES_MOCK.map((message) => (
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
