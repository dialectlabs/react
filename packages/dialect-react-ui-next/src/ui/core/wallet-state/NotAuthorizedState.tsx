import useDialectWallet from '../../../model/hooks/useDialectWallet';
import { Button, Switch } from '../primitives';

const NotAuthorizedState = () => {
  const {
    hardwareWalletForcedState: {
      get: isHardwareWalletForced,
      set: setHardwareWalletForced,
    },
    connectionInitiatedState: { set: setConnectionInitiated },
  } = useDialectWallet();

  return (
    <div>
      <h3>Verify Wallet</h3>
      <span>
        To continue, please prove you own this wallet by signing a{' '}
        {isHardwareWalletForced ? 'transaction' : 'message'}. It is free and
        does not involve the network.
      </span>
      <div>
        <span>Using ledger?</span>
        <Switch
          checked={isHardwareWalletForced}
          onClick={() => setHardwareWalletForced(!isHardwareWalletForced)}
        />
        <Button onClick={() => setConnectionInitiated(true)}>
          {isHardwareWalletForced ? 'Sign transaction' : 'Sign message'}
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorizedState;
