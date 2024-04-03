interface NoWalletErrorProps {
  message?: string | JSX.Element;
}

const NoWalletState = ({
  message = 'Wallet not connected',
}: NoWalletErrorProps) => {
  return (
    //TODO icon
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center">
      <h3 className="dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold">{message}</h3>
    </div>
  );
};

export default NoWalletState;
