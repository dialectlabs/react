import React, { useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { useTheme } from '../common/ThemeProvider';
import Error from './screens/Error';
import Main from './screens/Main';

enum Routes {
  Main = 'main',
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
}

interface ChatProps {
  inbox?: boolean;
  wrapperClassName?: string;
  contentWrapperClassName?: string;
  onModalClose?: () => void;
}

export default function Chat({
  inbox,
  wrapperClassName,
  contentWrapperClassName,
  onModalClose,
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
    [Routes.NoConnection]: (
      <Error type="NoConnection" onModalClose={onModalClose} inbox={inbox} />
    ),
    [Routes.NoWallet]: (
      <Error type="NoWallet" onModalClose={onModalClose} inbox={inbox} />
    ),
    [Routes.Main]: <Main onModalClose={onModalClose} inbox={inbox} />,
  };

  return (
    <div
      className={clsx(
        'dialect',
        wrapperClassName ? wrapperClassName : 'dt-h-full'
      )}
    >
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
