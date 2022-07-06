import { Centered } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

interface NoWalletErrorProps {
  message?: string | JSX.Element;
}

const NoWalletError = ({ message }: NoWalletErrorProps) => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.notConnected className="dt-mb-6 dt-opacity-60" />
      <span className="dt-text-center">
        {message ? message : 'Wallet not connected'}
      </span>
    </Centered>
  );
};

export default NoWalletError;
