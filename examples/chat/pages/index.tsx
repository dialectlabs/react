import React, { useEffect, useState } from 'react';

import { ChatButton, IncomingThemeVariables } from '@dialectlabs/react-ui';
import { WalletContext, Wallet as WalletButton } from '../components/Wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { defaultVariables } from '@dialectlabs/react-ui/components/common/ThemeProvider';
// pink: #B852DC
// teal: #59C29D
// dark: #353535
// light: #F6F6F6
// border-light: #F0F0F0
// blue: #448EF7

// TODO: Use useTheme instead of explicitly importing defaultVariables
export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-12 h-12 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700',
    popup: 'rounded-3xl shadow-xl shadow-neutral-900 border border-neutral-800',
  },
  light: {
    bellButton:
      'w-12 h-12 shadow-md hover:shadow-lg shadow-neutral-300 hover:shadow-neutral-400 text-[#59C29D]',
    popup: 'border border-[#F0F0F0] shadow-lg shadow-neutral-300 rounded-xl',
    colors: {
      primary: 'text-[#353535]',
    },
    button: `${defaultVariables.light.button} border-none bg-[#B852DC]`,
    highlighted: `${defaultVariables.light.highlighted} bg-[#F6F6F6] border border-[#F0F0F0]`,
    input: `${defaultVariables.light.input} border-b-[#59C29D] focus:ring-[#59C29D] text-[#59C29D]`,
    iconButton: `${defaultVariables.light.iconButton} hover:text-[#59C29D] hover:opacity-100`,
    avatar: `${defaultVariables.light.avatar} bg-[#F6F6F6]`,
    messageBubble: `${defaultVariables.light.messageBubble} border-none bg-[#448EF7] text-white`,
    // textArea: `${defaultVariables.light.textArea} border-[#59C29D]`,
    sendButton: `${defaultVariables.light.sendButton} bg-[#59C29D]`,
    bigButton: `${defaultVariables.light.bigButton} text-white bg-[#B852DC]`,
    bigButtonLoading: `${defaultVariables.light.bigButtonLoading} bg-[#B852DC] text-white`,
    // divider: `${defaultVariables.light.divider} bg-[#59C29D]`,
  },
};

type ThemeType = 'light' | 'dark' | undefined;

function AuthedHome() {
  // const wallet = useAnchorWallet();
  const wallet = useWallet();
  const [theme, setTheme] = useState<ThemeType>('dark');

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        const newColorScheme = event.matches ? 'dark' : 'light';
        setTheme(newColorScheme);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      <div className="flex flex-row justify-end p-2 items-center space-x-2">
        <ChatButton
          wallet={wallet}
          network={'localnet'}
          theme={theme}
          variables={themeVariables}
        />
        <WalletButton />
      </div>
      <div className="h-full text-2xl flex flex-col justify-center items-center">
        <code className="text-center text-neutral-400 dark:text-neutral-600 text-sm mb-2">
          @dialectlabs/react
        </code>
        <div>
          <code className="shrink text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B852DC] to-[#59C29D]">
            examples/chat
          </code>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <AuthedHome />
    </WalletContext>
  );
}
