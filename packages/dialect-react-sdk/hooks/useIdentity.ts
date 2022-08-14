import type { PublicKey } from "@solana/web3.js"

function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

type UseIdentityParams = {
  publicKey: PublicKey;
};

enum Types {
  PublicKey,
  SNS,
  CardinalTwitter,
}

type Identity = {
  avatarUrl?: string;
  name: string;
  link?: string;
  publicKey: PublicKey;
  type: Types;
};

type UseIdentityValue = {
  identity: Identity;
  loading: boolean;
};

const useIdentity = ({
  publicKey,
}: UseIdentityParams): UseIdentityValue => {
  return {
    loading: false,
    identity: {
      link: `https://explorer.solana.com/address/${publicKey.toString()}`,
      name: shortenAddress(publicKey.toBase58()),
      publicKey,
      type: Types.PublicKey,
    },
  }
}

export default useIdentity;
