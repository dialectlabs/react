import { Centered, Loader } from '../../../components/common';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

interface FailingGateErrorProps {
  message?: string | JSX.Element;
  isLoading?: boolean;
}

const FailingGateError = ({ message, isLoading }: FailingGateErrorProps) => {
  const { icons } = useTheme();

  return (
    <Centered>
      {isLoading ? (
        <>
          <Loader className="dt-mr-2" /> Verifying your eligibility to use dapp
          notifications
        </>
      ) : (
        <icons.noNotifications className="dt-mb-6 dt-opacity-60" />
      )}
      {!isLoading && (
        <span className="dt-text-center dt-max-w-sm dt-opacity-50">
          {message
            ? message
            : 'Your wallet is not eligible to receive notifications yet. Contact the dapp team if you think this is a mistake.'}
        </span>
      )}
    </Centered>
  );
};

export default FailingGateError;
