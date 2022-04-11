import React from 'react';
import logo from './logo.svg';
import './App.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ChatButton } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

function App() {
  const wallet = useWallet();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <WalletMultiButton />
        <ChatButton wallet={wallet} />
      </header>
    </div>
  );
}

export default App;
