import React, { useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { Footer } from '../common';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';
import NoConnection from './screens/NoConnection';
import NoWallet from './screens/NoWallet';
import Main from './screens/Main';

enum InboxRoutes {
  Main = 'main',
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
}

export default function Chat(): JSX.Element {
  const { disconnectedFromChain, isWalletConnected, dialects } = useDialect();

  const [activeRoute, setActiveRoute] = useState<InboxRoutes>(
    InboxRoutes.NoConnection
  );

  useEffect(
    function pickRoute() {
      if (disconnectedFromChain) {
        setActiveRoute(InboxRoutes.NoConnection);
      } else if (!isWalletConnected) {
        setActiveRoute(InboxRoutes.NoWallet);
      } else {
        setActiveRoute(InboxRoutes.Main);
      }
    },
    [disconnectedFromChain, isWalletConnected]
  );

  const { colors, modal } = useTheme();

  const routes: Record<InboxRoutes, React.ReactNode> = {
    [InboxRoutes.NoConnection]: <NoConnection />,
    [InboxRoutes.NoWallet]: <NoWallet />,
    [InboxRoutes.Main]: <Main />,
  };

  return (
    <div className="dialect h-full">
      <div
        className={cs(
          'flex flex-col h-full shadow-md overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <div className="h-full overflow-y-scroll">{routes[activeRoute]}</div>
        <Footer
          showBackground={Boolean(dialects?.length && dialects?.length > 4)}
        />
      </div>
    </div>
  );
}
