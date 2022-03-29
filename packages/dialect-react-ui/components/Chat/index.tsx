import React, { useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { Footer } from '../common';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';
import NoConnection from './screens/NoConnection';
import NoWallet from './screens/NoWallet';
import Main from './screens/Main';

enum Routes {
  Main = 'main',
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
}

interface ChatProps {
  inbox?: boolean;
}

export default function Chat({ inbox }: ChatProps): JSX.Element {
  const { disconnectedFromChain, isWalletConnected, dialects } = useDialect();

  const [activeRoute, setActiveRoute] = useState<Routes>(Routes.NoConnection);

  useEffect(
    function pickRoute() {
      if (disconnectedFromChain) {
        setActiveRoute(Routes.NoConnection);
      } else if (!isWalletConnected) {
        setActiveRoute(Routes.NoWallet);
      } else {
        setActiveRoute(Routes.Main);
      }
    },
    [disconnectedFromChain, isWalletConnected]
  );

  const { colors, modal } = useTheme();

  const routes: Record<Routes, React.ReactNode> = {
    [Routes.NoConnection]: <NoConnection />,
    [Routes.NoWallet]: <NoWallet />,
    [Routes.Main]: <Main inbox={inbox} />,
  };

  return (
    <div className="dialect dt-h-full">
      <div
        className={cs(
          'dt-flex dt-flex-col dt-h-full dt-shadow-md dt-overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <div className="dt-h-full dt-overflow-y-scroll">
          {routes[activeRoute]}
        </div>
        <Footer
          showBackground={Boolean(dialects?.length && dialects?.length > 4)}
        />
      </div>
    </div>
  );
}
