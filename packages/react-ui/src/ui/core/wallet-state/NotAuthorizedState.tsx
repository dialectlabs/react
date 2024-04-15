import { useDialectWallet } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ClassTokens } from '../../theme';
import { Button, ButtonType, Switch } from '../primitives';

const NotAuthorizedState = () => {
  const {
    hardwareWalletForcedState: {
      get: isHardwareWalletForced,
      set: setHardwareWalletForced,
    },
    connectionInitiatedState: { set: setConnectionInitiated },
  } = useDialectWallet();

  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        Verify Wallet
      </h3>
      <span
        className={clsx(
          'dt-text-center dt-text-text dt-font-normal',
          ClassTokens.Text.Secondary,
        )}
      >
        To continue, please prove you own this wallet by signing a{' '}
        {isHardwareWalletForced ? 'transaction' : 'message'}. It is free and
        does not involve the network.
      </span>
      <div className="dt-flex dt-w-full dt-flex-col dt-items-center dt-pt-6 ">
        <div
          className={clsx(
            ClassTokens.Stroke.Input.Primary,
            ClassTokens.Text.Primary,
            ClassTokens.Radius.Medium,
            'dt-mb-4 dt-flex dt-h-12 dt-w-full dt-flex-row dt-items-center dt-justify-between dt-border dt-px-3 dt-py-2',
          )}
        >
          <span>Using ledger?</span>
          <Switch
            checked={isHardwareWalletForced}
            onChange={(next) => setHardwareWalletForced(next)}
          />
        </div>
        <Button
          type={ButtonType.Primary}
          size="large"
          stretch={true}
          onClick={() => setConnectionInitiated(true)}
        >
          {isHardwareWalletForced ? 'Sign transaction' : 'Sign message'}
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorizedState;
