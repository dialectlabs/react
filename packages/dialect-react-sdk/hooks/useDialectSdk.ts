import type { DialectSdk as DialectSdkType } from '@dialectlabs/sdk';
import { DialectSdk } from '../context/DialectContext/Sdk';

const useDialectSdk = <TUnsafe extends boolean = false>(
  unsafe?: TUnsafe
): TUnsafe extends true ? DialectSdkType | null : DialectSdkType => {
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
