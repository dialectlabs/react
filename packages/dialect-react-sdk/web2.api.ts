// FIXME: this is a deprecated web2 api
// new one will be provided in sdk

import type { DialectWalletAdapter } from '@dialectlabs/sdk';

// Change to localhost for localdev
// TODO: make this customizable via env
const DIALECT_BASE_URL = 'https://dialectapi.to';

export type Address = 'wallet' | 'email' | 'sms' | 'telegram';

export type AddressType = {
  id?: string;
  addressId?: string;
  type?: Address;
  verified?: boolean;
  value?: string;
  dapp?: string;
  enabled?: boolean;
};

const signPayload = async (
  wallet: DialectWalletAdapter,
  payload: Uint8Array
) => {
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
};

const generateToken = async (wallet: DialectWalletAdapter): Promise<string> => {
  const tokenTTLMinutes = 180;
  const now = new Date().getTime();

  const expirationTime = now + tokenTTLMinutes * 60000;
  const dateEncoded = new TextEncoder().encode(
    btoa(JSON.stringify(expirationTime))
  );

  const { signature } = await signPayload(wallet, dateEncoded);

  const base64Signature = btoa(
    String.fromCharCode.apply(null, signature as unknown as number[])
  );

  return `${expirationTime}.${base64Signature}`;
};

const saveToken = (token: string, wallet: DialectWalletAdapter) => {
  if (!window) return;
  window.sessionStorage.setItem(
    `dialect-auth-token-${wallet?.publicKey?.toBase58()}`,
    token
  );
};

export const removeToken = (wallet: DialectWalletAdapter) => {
  if (!window) return;
  window.sessionStorage.removeItem(
    `dialect-auth-token-${wallet?.publicKey?.toBase58()}`
  );
};

const getTokenFromStorage = (
  wallet: DialectWalletAdapter
): string | undefined => {
  if (!window) return;
  const token = window.sessionStorage.getItem(
    `dialect-auth-token-${wallet?.publicKey?.toBase58()}`
  );

  if (!token) return;
  return token;
};

const isTokenExpired = (token: string) => {
  const expirationTime = token.split('.')[0];
  if (!expirationTime) return false;
  return +expirationTime < new Date().getTime();
};

export const fetchJSON = async (
  wallet: DialectWalletAdapter,
  url: string,
  options: any = {},
  ...args: any[]
) => {
  let headers = {};
  if (
    options?.method === 'POST' ||
    options?.method === 'PUT' ||
    options?.method === 'DELETE'
  ) {
    let token = getTokenFromStorage(wallet);

    if (!token || isTokenExpired(token)) {
      token = await generateToken(wallet);
      saveToken(token, wallet);
    }

    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(
    url,
    {
      ...options,
      headers: { ...options?.headers, ...headers },
    },
    //@ts-ignore
    ...args
  );
  if (response.ok) {
    return response;
  } else {
    const data = await response.json();
    throw new Error(data.message);
  }
};

export const fetchAddressesForDapp = async (
  wallet: DialectWalletAdapter,
  dapp: string
) => {
  const rawResponse = await fetchJSON(
    wallet,
    `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toString()}/dapps/${dapp}/addresses`
  );
  const content = await rawResponse.json();
  return content;
};

// Save email, phone or other address along with wallet address
export const saveAddress = async (
  wallet: DialectWalletAdapter,
  dapp: string,
  address: AddressType
) => {
  const rawResponse = await fetchJSON(
    wallet,
    `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toBase58()}/dapps/${dapp}/addresses`,
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
};

export const updateAddress = async (
  wallet: DialectWalletAdapter,
  dapp: string,
  address: AddressType
) => {
  let rawResponse;
  if (address?.id) {
    rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toString()}/dapps/${dapp}/addresses/${
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
  } else {
    rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toBase58()}/dapps/${dapp}/addresses`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      }
    );
  }
  const content = await rawResponse.json();
  return content;
};

// Save email, phone or other address along with wallet address
export const deleteAddress = async (
  wallet: DialectWalletAdapter,
  address: AddressType
) => {
  await fetchJSON(
    wallet,
    `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toString()}/addresses/${
      address.addressId
    }`,
    {
      method: 'DELETE',
    }
  );
};

export const verifyCode = async (
  wallet: DialectWalletAdapter,
  dapp: string,
  address: AddressType,
  code: string
) => {
  const rawResponse = await fetchJSON(
    wallet,
    `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toString()}/dapps/${dapp}/addresses/${
      address?.id
    }/verify`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, addressId: address.addressId }),
    }
  );
  const content = await rawResponse.json();
  return content;
};

export const resendCode = async (
  wallet: DialectWalletAdapter,
  dapp: string,
  address: AddressType
) => {
  await fetchJSON(
    wallet,
    `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey?.toString()}/dapps/${dapp}/addresses/${
      address?.id
    }/resendCode`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    }
  );
};
