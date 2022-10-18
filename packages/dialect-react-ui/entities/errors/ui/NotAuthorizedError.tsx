import { useDialectWallet } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { Button, Centered, ToggleSection } from '../../../components/common';
import { H3 } from '../../../components/common/preflighted';
import { useTheme } from '../../../components/common/providers/DialectThemeProvider';

const NotAuthorizedError = () => {
  const { textStyles } = useTheme();
  const {
    hardwareWalletForcedState: {
      get: isHardwareWalletForced,
      set: setHardwareWalletForced,
    },
    connectionInitiatedState: { set: setConnectionInitiated },
  } = useDialectWallet();

  return (
    <Centered>
      <H3
        className={clsx(textStyles.header, 'dt-flex dt-items-center dt-mb-4')}
      >
        Verify Wallet
      </H3>
      <span
        className={clsx(
          textStyles.body,
          'dt-flex dt-items-center dt-mb-4 dt-w-[80%] dt-text-center'
        )}
      >
        To continue, please prove you own this wallet by signing a{' '}
        {isHardwareWalletForced ? 'transaction' : 'message'}. It is free and
        does not involve the network.
      </span>
      <div className="dt-w-[80%]">
        <ToggleSection
          noBorder
          title="Using ledger?"
          checked={isHardwareWalletForced}
          onChange={(next) => setHardwareWalletForced(next)}
        />
        <Button
          onClick={() => setConnectionInitiated(true)}
          className="dt-w-full dt-mt-2"
        >
          {isHardwareWalletForced ? 'Sign transaction' : 'Sign message'}
        </Button>
      </div>
    </Centered>
  );
};

export default NotAuthorizedError;
