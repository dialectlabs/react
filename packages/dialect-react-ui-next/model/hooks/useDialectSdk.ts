import type {
  BlockchainSdk,
  DialectSdk as DialectSdkType,
} from '@dialectlabs/sdk';
import { DialectSdk } from '../internal/context/DialectSdk';

const useDialectSdk = <TUnsafe extends boolean = false>(
  unsafe?: TUnsafe,
): TUnsafe extends true
  ? DialectSdkType<BlockchainSdk> | null
  : DialectSdkType<BlockchainSdk> => {
  const { sdk } = DialectSdk.useContainer();
  if (unsafe) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return sdk;
  }
  if (!sdk) {
    throw new Error('sdk not initialized');
  }
  return sdk;
};

export default useDialectSdk;
