import { Centered } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

const NoConnectionError = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
      <span className="dt-opacity-60">
        Waiting for connection to Solana blockchain
      </span>
    </Centered>
  );
};

export default NoConnectionError;
