import * as DialectErrors from './utils/errors';
import type { WalletType, ProgramType } from './components/ApiContext';
import type { MessageType, DialectAccount } from './components/DialectContext';
import type { AddressType } from './api';
import type { ParsedErrorData } from './utils/errors';

export * from './components/ApiContext';
export * from './components/DialectContext';
export { connected } from './utils/helpers';
export * from './api';

export { DialectErrors };

export type {
  AddressType,
  ParsedErrorData,
  WalletType,
  ProgramType,
  MessageType,
  DialectAccount,
};
