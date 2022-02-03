export const ParsedErrorType = {
  InsufficientFunds: 'INSUFFICIENT_FUNDS',
  DisconnectedFromChain: 'DISCONNECTED_FROM_CHAIN',
  UnknownError: 'UNKNOWN_ERROR',
} as const;
type ParsedErrorTypeKeys = keyof typeof ParsedErrorType;

export interface ParsedErrorData {
  type: typeof ParsedErrorType[ParsedErrorTypeKeys];
  title: string;
  message: string;
  matchers?: Array<string | RegExp>;
}

// TODO: Implement Error instances?
const insufficientFunds: ParsedErrorData = {
  type: ParsedErrorType.InsufficientFunds,
  title: 'Insufficient Funds',
  message:
    'You do not have enough funds to complete this transaction. Please deposit more funds and try again.',
  matchers: [
    'Attempt to debit an account but found no record of a prior credit.',
    /(0x1)$/gm,
  ],
};

const disconnectedFromChain: ParsedErrorData = {
  type: ParsedErrorType.DisconnectedFromChain,
  title: 'Lost connection to Solana blockchain',
  message:
    'Having problems reaching Solana blockchain. Please try again later.',
  matchers: ['Network request failed'],
};

const unknownError: ParsedErrorData = {
  type: ParsedErrorType.UnknownError,
  title: 'Error',
  message: 'Something went wrong. Please try again later.',
};

const errors: ParsedErrorData[] = [insufficientFunds, disconnectedFromChain];

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
      throw parseError(e as Error); // TODO: it's unlikely that something else is going to be passed here, but we should think about that later on
    }
  };
