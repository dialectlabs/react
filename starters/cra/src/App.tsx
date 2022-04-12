import React from 'react';
import './App.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ChatButton, IncomingThemeVariables } from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export const themeVariables: IncomingThemeVariables = {
  dark: {
    modal: 'modal',
  },
};

function App() {
  const wallet = useWallet();

  return (
    <div className="App">
      <header className="App-header">
        <div className="buttons">
          <WalletMultiButton />
          <ChatButton wallet={wallet} variables={themeVariables} />
        </div>
      </header>
    </div>
  );
}

export default App;
