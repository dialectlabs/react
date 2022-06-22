import type { DialectSdk as DialectSdkType } from '@dialectlabs/sdk';
import { DialectSdk } from '../context/DialectContext/Sdk';

const useDialectSdk = (): DialectSdkType => {
  const { sdk } = DialectSdk.useContainer();
  if (!sdk) {
    throw new Error('sdk not initialized');
  }
  return sdk;
};

export default useDialectSdk;
