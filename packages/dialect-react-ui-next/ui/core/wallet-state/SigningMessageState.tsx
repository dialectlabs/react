const SigningMessageState = () => {
  return (
    <div>
      {/*TODO loader*/}
      <h3>Waiting for your wallet</h3>
      <p className="dt-text-center dt-max-w-sm dt-opacity-50">
        To continue please prove you own a wallet by approving signing request.
        It is free and does not involve the network.
      </p>
    </div>
  );
};

export default SigningMessageState;
