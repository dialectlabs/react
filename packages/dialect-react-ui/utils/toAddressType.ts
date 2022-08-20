import { AddressType, IllegalStateError } from '@dialectlabs/react-sdk';

export type PersistedAddressType = 'email' | 'wallet' | 'telegram' | 'sms';

const persistedAddressTypeToAddressType: Record<
  PersistedAddressType,
  AddressType
> = {
  ['email']: AddressType.Email,
  ['sms']: AddressType.PhoneNumber,
  ['telegram']: AddressType.Telegram,
  ['wallet']: AddressType.Wallet,
};

export default function toAddressType(type: PersistedAddressType): AddressType {
  const addressTypeDto = persistedAddressTypeToAddressType[type];
  if (!addressTypeDto) {
    throw new IllegalStateError(`Unknown address type ${type}`);
  }
  return addressTypeDto;
}
