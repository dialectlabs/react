import fetch from 'unfetch';
import * as anchor from '@project-serum/anchor';
import { withErrorParsing } from '../utils/errors';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { WalletType } from '../components/ApiContext';

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

const signPayload = async (wallet: WalletContextState, payload: Uint8Array) => {
  try {
    const signature = wallet.signMessage
      ? await wallet.signMessage(payload)
      : await Promise.resolve(null);
    if (!signature)
      throw new Error(
        'Your wallet does not support signing messages. Please use a wallet that supports signing messages, such as Phantom.'
      );
    return {
      signature,
      publicKey: wallet.publicKey,
    };
  } catch (err) {
    console.warn(err);
    console.log('[error] signMessage: ' + JSON.stringify(err));
  }
};

export const fetchJSON = async (
  wallet: WalletType,
  url: string,
  options: object = {},
  ...args: any[]
) => {
  let headers = {};
  if (
    options?.method === 'POST' ||
    options?.method === 'PUT' ||
    options?.method === 'DELETE'
  ) {
    const tokenTTLMinutes = 5;
    const now = new Date().getTime();
    const expirationTime = now + tokenTTLMinutes * 60;
    const dateEncoded = new TextEncoder().encode(
      btoa(JSON.stringify(expirationTime))
    );
    const { signature } = await signPayload(
      wallet as WalletContextState,
      dateEncoded
    );
    const base64Signature = btoa(String.fromCharCode.apply(null, signature));
    headers = {
      Authorization: `${expirationTime}.${base64Signature}`,
    };
  }

  const response: ReturnType<F> = await fetch(
    url,
    {
      ...options,
      headers: { ...options?.headers, ...headers },
    },
    ...args
  );
  if (response.ok) {
    return response;
  } else {
    const error = new Error(response.statusText || response.status);
    error.response = response;
    throw error;
  }
};

export const fetchAddressesForDapp = withErrorParsing(
  async (wallet: WalletType, dapp: string) => {
    const rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/wallets/${wallet?.publicKey.toString()}/dapps/${dapp}/addresses`
    );
    const content = await rawResponse.json();
    return content;
  }
);

// Save email, phone or other address along with wallet address
export const saveAddress = withErrorParsing(
  async (wallet: WalletType, dapp: string, address: AddressType) => {
    const rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/wallets/${wallet.publicKey.toBase58()}/dapps/${dapp}/addresses`,
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

export const updateAddress = withErrorParsing(
  async (wallet: WalletType, dapp: string, address: AddressType) => {
    const rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/wallets/${wallet?.publicKey.toString()}/dapps/${dapp}/addresses/${
        address?.id
      }`,
      {
        method: 'PUT',
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
  async (wallet: WalletType, address: AddressType) => {
    const rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/wallets/${wallet?.publicKey.toString()}/addresses/${
        address.addressId
      }`,
      {
        method: 'DELETE',
      }
    );
    return {};
  }
);
