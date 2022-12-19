import { getDefaultProvider } from 'ethers';
import React from 'react';
import { createClient, useAccount, useConnect, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

function shortenAddress(address: string, chars = 4): string {
  const addr = address.toString();
  return `${addr.substring(0, chars)}...${addr.substring(addr.length - chars)}`;
}

export const EvmWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <button
      className="border border-gray-500 text-white px-4 py-3 rounded-md"
      onClick={() => {
        connect();
      }}
    >
      {isConnected ? shortenAddress(address || '') : 'Connect Evm wallet'}
    </button>
  );
};

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export const EvmWalletContext: React.FC<any> = (props) => {
  return <WagmiConfig client={client}>{props.children}</WagmiConfig>;
};
