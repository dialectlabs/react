import { Centered } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

const NoWalletError = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.notConnected className="dt-mb-6 dt-opacity-60" />
      <span className="dt-opacity-60">Wallet not connected</span>
    </Centered>
  );
};

export default NoWalletError;
