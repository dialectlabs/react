interface NoWalletErrorProps {
  message?: string | JSX.Element;
}

const NoWalletState = ({
  message = 'Wallet not connected',
}: NoWalletErrorProps) => {
  return (
    <div>
      <span>{message}</span>
    </div>
  );
};

export default NoWalletState;
