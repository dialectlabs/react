import clsx from 'clsx';
import { useTheme } from './providers/DialectThemeProvider';

const OnChainIndicator = () => {
  const { messageOnChain } = useTheme();

  return (
    <span
      className={clsx('dt-w-2 dt-h-2 dt-rounded-full dt-ml-2', messageOnChain)}
    />
  );
};

export default OnChainIndicator;
