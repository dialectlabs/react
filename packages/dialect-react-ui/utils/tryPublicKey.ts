import { PublicKey } from '@solana/web3.js';

const tryPublicKey = (addressString: string): PublicKey | null => {
  try {
    return new PublicKey(addressString);
  } catch (e) {
    return null;
  }
};

export default tryPublicKey;
