import fetch from 'unfetch';
import { withErrorParsing } from '../utils/errors';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import type { TokenType, WalletType } from '../components/ApiContext';

// TODO: make this customizable
const DIALECT_BASE_URL = '/api';

export type AddressType = {
  id?: string;
  addressId?: string;
  type?: 'email' | 'phone' | 'telegram';
  verified?: boolean;
  value?: string;
  dapp?: string;
  enabled?: boolean;
};

const signPayload = async (wallet: WalletContextState, payload: Uint8Array) => {
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

const generateToken = async (wallet: WalletType): Promise<TokenType> => {
  const tokenTTLMinutes = 180;
  const now = new Date().getTime();

  const expirationTime = now + tokenTTLMinutes * 60000;
  const dateEncoded = new TextEncoder().encode(
    btoa(JSON.stringify(expirationTime))
  );

  const { signature } = await signPayload(
    wallet as WalletContextState,
    dateEncoded
  );

  const base64Signature = btoa(
    String.fromCharCode.apply(null, signature as unknown as number[])
  );

  return {
    expirationTime: expirationTime.toString(),
    base64Signature
  };
}

const saveToken = (token: TokenType) => {
  window.sessionStorage.setItem("expirationTime", token.expirationTime.toString());
  window.sessionStorage.setItem("base64Signature", token.base64Signature)
}

export const removeToken = () => {
  window.sessionStorage.removeItem("expirationTime");
  window.sessionStorage.removeItem("base64Signature")
}

const getTokenFromStorage = (): TokenType | undefined => {
  const expirationTime =  window.sessionStorage.getItem("expirationTime");
  const base64Signature = window.sessionStorage.getItem("base64Signature");

  if (!expirationTime || !base64Signature) return;
  return {
    expirationTime, 
    base64Signature
  }
}

const isTokenExpired = (token: TokenType) => {
  const expirationTime = +token.expirationTime;
  return expirationTime < new Date().getTime();
}

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
    
    let token = getTokenFromStorage();

    if (!token || isTokenExpired(token)) {
      token = await generateToken(wallet);
      saveToken(token);
    }

    headers = {
      Authorization: `Bearer ${token?.expirationTime}.${token?.base64Signature}`,
    };
  }

  const response = await fetch(
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
    const error = new Error(
      response.statusText || `Response status: ${response.status}`
    );
    error.response = response;
    throw error;
  }
};

export const fetchAddressesForDapp = withErrorParsing(
  async (wallet: WalletType, dapp: string) => {
    const rawResponse = await fetchJSON(
      wallet,
      `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey.toString()}/dapps/${dapp}/addresses`
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
      `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey.toBase58()}/dapps/${dapp}/addresses`,
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
      `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey.toString()}/dapps/${dapp}/addresses/${
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
      `${DIALECT_BASE_URL}/v0/wallets/${wallet?.publicKey.toString()}/addresses/${
        address.addressId
      }`,
      {
        method: 'DELETE',
      }
    );
    return {};
  }
);
