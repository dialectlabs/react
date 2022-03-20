import fetch from 'unfetch';
import * as anchor from '@project-serum/anchor';
import { withErrorParsing } from '../utils/errors';

const DIALECT_BASE_URL = '/api';

export type AddressType = {
  id?: string;
  addressId?: string;
  type: 'email' | 'phone' | 'telegram';
  verified: boolean;
  value: string;
  dapp: string;
  enabled: boolean;
};

export const fetchAddressesForDapp = withErrorParsing(
  async (wallet: anchor.web3.PublicKey, dapp: string) => {
    const rawResponse = await fetch(
      `${DIALECT_BASE_URL}/wallets/${wallet.toString()}/dapps/${dapp}/addresses`
    );
    const content = await rawResponse.json();
    return content;
  }
);

// Save email, phone or other address along with wallet address
export const saveAddress = withErrorParsing(
  async (wallet: anchor.web3.PublicKey, dapp: string, address: AddressType) => {
    const rawResponse = await fetch(
      `${DIALECT_BASE_URL}/wallets/${wallet.toString()}/dapps/${dapp}/addresses`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      }
    );
    const content = await rawResponse.json();
    return content;
  }
);

// Save email, phone or other address along with wallet address
export const deleteAddress = withErrorParsing(
  async (wallet: anchor.web3.PublicKey, address: AddressType) => {
    const rawResponse = await fetch(
      `${DIALECT_BASE_URL}/wallets/${wallet.toString()}/addresses/${
        address.addressId
      }`,
      {
        method: 'DELETE',
      }
    );
    const content = await rawResponse.json();
    return content;
  }
);
