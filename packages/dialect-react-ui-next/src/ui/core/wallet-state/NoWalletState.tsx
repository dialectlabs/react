import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

interface NoWalletErrorProps {
  message?: string | JSX.Element;
}

const NoWalletState = ({
  message = 'Wallet not connected',
}: NoWalletErrorProps) => {
  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Wallet width={24} height={24} />
      </div>

      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        {message}
      </h3>
    </div>
  );
};

export default NoWalletState;
