export interface ParsedError {
  type: string;
  title: string;
  message: string;
  matchers?: Array<string | RegExp>;
}

// TODO: Probably matcher could be anchor error code, instead of a message
// TODO: Implement Error instances?
const insufficientFunds = {
  type: 'INSUFFICIENT_FUNDS',
  title: 'Insufficient Funds',
  message:
    'You do not have enough funds to complete this transaction. Please deposit more funds and try again.',
  matchers: [
    'Attempt to debit an account but found no record of a prior credit.',
    /(0x1)$/gm,
  ],
};

const unknownError = {
  type: 'UNKNOWN_ERROR',
  title: 'Error',
  message: 'Something went wrong. Please try again later.',
};

const errors: ParsedError[] = [insufficientFunds, unknownError];

const parseError = (error: Error) => {
  console.log('parsing error...', error);

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
