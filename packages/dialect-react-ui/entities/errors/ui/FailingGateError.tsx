import clsx from 'clsx';
import { Centered, Loader } from '../../../components/common';
import { H3 } from '../../../components/common/preflighted';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

interface FailingGateErrorProps {
  message?: string | JSX.Element;
  isLoading?: boolean;
}

const FailingGateError = ({ message, isLoading }: FailingGateErrorProps) => {
  const { icons, textStyles } = useTheme();

  return (
    <Centered>
      {isLoading ? (
        <>
          <H3
            className={clsx(
              textStyles.header,
              'dt-flex dt-items-center dt-mb-1 dt-mx-4'
            )}
          >
            <Loader className="dt-mr-2" /> Verifying your eligibility to use
            dapp notifications
          </H3>
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
