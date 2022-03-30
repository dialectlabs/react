import React, { useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import { Footer } from '../common';
import { useTheme } from '../common/ThemeProvider';
import NoConnection from './screens/NoConnection';
import NoWallet from './screens/NoWallet';
import Main from './screens/Main';
import clsx from 'clsx';

enum Routes {
  Main = 'main',
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
}

interface ChatProps {
  inbox?: boolean;
  wrapperClassName?: string;
  contentWrapperClassName?: string;
}

export default function Chat({
  inbox,
  wrapperClassName,
  contentWrapperClassName,
}: ChatProps): JSX.Element {
  const { disconnectedFromChain, isWalletConnected } = useDialect();

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
    <div className={clsx('dialect dt-h-full', wrapperClassName)}>
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-h-full dt-shadow-md dt-overflow-hidden',
          colors.primary,
          colors.bg,
          contentWrapperClassName,
          { [modal]: !inbox }
        )}
      >
        <div className="dt-h-full">{routes[activeRoute]}</div>
      </div>
    </div>
  );
}
