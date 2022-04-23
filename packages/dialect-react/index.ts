import * as DialectErrors from './utils/errors';
import type { WalletType, ProgramType } from './components/ApiContext';
import type { MessageType, DialectAccount } from './components/DialectContext';
import type { AddressType } from './api';
import type { ParsedErrorData } from './utils/errors';

export { ApiProvider, useApi, getWalletName } from './components/ApiContext';
export { DialectProvider, useDialect } from './components/DialectContext';
export { connected } from './utils/helpers';
export {
  formatTimestamp,
  getDialectAddressForMemberPubkeys,
  getDialectAddressWithOtherMember,
  createDialectForMembers,
  createMetadata,
  deleteAddress,
  deleteDialect,
  fetchDialectForMembers,
  fetchDialect,
  fetchDialects,
  deleteMetadata,
  fetchAddressesForDapp,
  fetchMetadata,
  saveAddress,
  updateAddress,
  sendMessage,
} from './api';

export { DialectErrors };

export type {
  AddressType,
  ParsedErrorData,
  WalletType,
  ProgramType,
  MessageType,
  DialectAccount,
};
