import { Button, Input } from '../../../core/primitives';

//TODO 'In App' instead of 'Wallet' ?
export const WalletChannel = () => {
  return (
    <div className="dt-flex dt-flex-col dt-gap-2">
      <Input
        label="Wallet"
        value="Abcd...wxyz"
        rightAdornment={<Button>Enable</Button>}
      />
    </div>
  );
};
