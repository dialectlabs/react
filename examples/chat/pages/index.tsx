import React, { useEffect, useState } from 'react';

import { ChatButton, IncomingThemeVariables } from '@dialectlabs/react-ui';
import { WalletContext, Wallet as WalletButton } from '../components/Wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { defaultVariables } from '@dialectlabs/react-ui/components/common/ThemeProvider';
// pink: #B852DC
// teal: #59C29D
// dark: #353535
// light: #F6F6F6
// dt-border-light: #F0F0F0
// blue: #448EF7

// TODO: Use useTheme instead of explicitly importing defaultVariables
export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'dt-w-12 dt-h-12 dt-shadow-xl dt-shadow-neutral-800 dt-border dt-border-neutral-600 hover:dt-shadow-neutral-700',
    modal:
      'dt-rounded-3xl dt-shadow-xl dt-shadow-neutral-900 dt-border dt-border-neutral-800',
  },
  light: {
    bellButton:
      'dt-w-12 dt-h-12 dt-shadow-md hover:dt-shadow-lg dt-shadow-neutral-300 hover:dt-shadow-neutral-400 dt-text-[#59C29D]',
    modal:
      'dt-border border-[#F0F0F0] dt-shadow-lg dt-shadow-neutral-300 dt-rounded-xl',
    colors: {
      primary: 'dt-text-[#353535]',
    },
    button: `${defaultVariables.light.button} dt-border-none dt-bg-[#B852DC]`,
    highlighted: `${defaultVariables.light.highlighted} dt-bg-[#F6F6F6] dt-border dt-border-[#F0F0F0]`,
    input: `${defaultVariables.light.input} dt-border-b-[#59C29D] focus:dt-ring-[#59C29D] dt-text-[#59C29D]`,
    iconButton: `${defaultVariables.light.iconButton} hover:dt-text-[#59C29D] hover:dt-opacity-100`,
    avatar: `${defaultVariables.light.avatar} dt-bg-[#F6F6F6]`,
    messageBubble: `${defaultVariables.light.messageBubble} dt-border-none dt-bg-[#448EF7] dt-text-white`,
    sendButton: `${defaultVariables.light.sendButton} dt-bg-[#59C29D]`,
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
    <div className="dt-flex dt-flex-col dt-h-screen dt-bg-white dark:dt-bg-black">
      <div className="dt-flex dt-flex-row dt-justify-end dt-p-2 dt-items-center dt-space-x-2">
        <ChatButton
          wallet={wallet}
          network={'localnet'}
          theme={theme}
          variables={themeVariables}
        />
        <WalletButton />
      </div>
      <div className="dt-h-full dt-text-2xl dt-flex dt-flex-col dt-justify-center dt-items-center">
        <code className="dt-text-center dt-text-neutral-400 dark:dt-text-neutral-600 dt-text-sm dt-mb-2">
          @dialectlabs/react
        </code>
        <div>
          <code className="shrink dt-text-center dt-text-transparent dt-bg-clip-text dt-bg-gradient-to-r dt-from-[#B852DC] dt-to-[#59C29D]">
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
