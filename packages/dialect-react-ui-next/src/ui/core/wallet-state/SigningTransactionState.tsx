import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

const SigningTransactionState = () => {
  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Loader width={24} height={24} />
      </div>

      <h3 className="dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold">
        Waiting for your wallet
      </h3>
      <p
        className={clsx(
          'dt-text-center dt-text-text',
          ClassTokens.Text.Secondary,
        )}
      >
        To continue please prove you own this wallet by signing a transaction.
        This transaction <b>will not</b> be submitted to the blockchain, and is
        free.
      </p>
    </div>
  );
};

export default SigningTransactionState;
