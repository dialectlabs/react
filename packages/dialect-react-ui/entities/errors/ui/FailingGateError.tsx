import { Centered } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

interface FailingGateErrorProps {
  message?: string | JSX.Element;
}

const FailingGateError = ({ message }: FailingGateErrorProps) => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.noNotifications className="dt-mb-6 dt-opacity-60" />
      <span className="dt-text-center">
        {message
          ? message
          : 'Your wallet is not eligible to receive notifications yet. Contact the dapp team if you think this is a mistake.'}
      </span>
    </Centered>
  );
};

export default FailingGateError;
