const SigningTransactionState = () => {
  return (
    <div>
      {/*TODO loader*/}
      <h3>Waiting for your wallet</h3>
      <p>
        To continue please prove you own this wallet by signing a transaction.
        This transaction <b>will not</b> be submited to the blockchain, and is
        free.
      </p>
    </div>
  );
};

export default SigningTransactionState;
