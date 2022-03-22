export const ParsedErrorType = {
  InsufficientFunds: 'INSUFFICIENT_FUNDS',
  DisconnectedFromChain: 'DISCONNECTED_FROM_CHAIN',
  CannotDecrypt: 'CANNOT_DECRYPT',
  UnknownError: 'UNKNOWN_ERROR',
  NoAccount: 'NO_ACCOUNT',
} as const;
type ParsedErrorTypeKeys = keyof typeof ParsedErrorType;

export interface ParsedErrorData {
  type: typeof ParsedErrorType[ParsedErrorTypeKeys];
  title: string;
  message: string;
  matchers?: Array<string | RegExp>;
}

// TODO: Implement Error instances?
export const insufficientFunds: ParsedErrorData = {
  type: ParsedErrorType.InsufficientFunds,
  title: 'Insufficient Funds',
  message:
    'You do not have enough funds to complete this transaction. Please deposit more funds and try again.',
  matchers: [
    'Attempt to debit an account but found no record of a prior credit.',
    /(0x1)$/gm,
  ],
};

export const disconnectedFromChain: ParsedErrorData = {
  type: ParsedErrorType.DisconnectedFromChain,
  title: 'Lost connection to Solana blockchain',
  message:
    'Having problems reaching Solana blockchain. Please try again later.',
  matchers: ['Network request failed'],
};

export const cannotDecryptDialect: ParsedErrorData = {
  type: ParsedErrorType.CannotDecrypt,
  title: 'Cannot decrypt messages',
  message:
    "This dialect's messages are encrypted and because you do not have access to the private key in this context.",
  matchers: ['Authentication failed during decryption attempt'],
};

export const noAccount: ParsedErrorData = {
  type: ParsedErrorType.NoAccount,
  title: 'Error',
  message: 'Account does not exist',
  matchers: ['Account does not exist'],
};

export const unknownError: ParsedErrorData = {
  type: ParsedErrorType.UnknownError,
  title: 'Error',
  message: 'Something went wrong. Please try again later.',
};

const errors: ParsedErrorData[] = [
  insufficientFunds,
  disconnectedFromChain,
  cannotDecryptDialect,
  noAccount,
];

const parseError = (error: Error) => {
  return (
    errors.find((err) =>
      err.matchers?.find((matcher) => error.message.match(matcher))
    ) || unknownError
  );
};

export const withErrorParsing =
  <F extends (...args: any[]) => Promise<any>>(
    fn: F
  ): ((...args: Parameters<F>) => ReturnType<F>) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Intentional ignore, due to issues with ReturnType and async functions
  async (...args: Parameters<F>) => {
    try {
      const result: ReturnType<F> = await fn(...args);
      return result;
    } catch (e) {
      const parsedError = parseError(e as Error); // TODO: it's unlikely that something else is going to be passed here, but we should think about that later on
      throw parsedError;
    }
  };
