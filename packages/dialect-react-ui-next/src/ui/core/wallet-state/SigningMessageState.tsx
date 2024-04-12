import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

const SigningMessageState = () => {
  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Loader width={24} height={24} />
      </div>

      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        Waiting for your wallet
      </h3>
      <p
        className={clsx(
          'dt-text-center dt-text-text dt-font-normal',
          ClassTokens.Text.Secondary,
        )}
      >
        To continue please prove you own a wallet by approving signing request.
        It is free and does not involve the network.
      </p>
    </div>
  );
};

export default SigningMessageState;
