import type { DialectSdk } from '@dialectlabs/sdk';
import useDialectContext from './useDialectContext';

const useDialectSdk = (): DialectSdk => {
  const { sdk } = useDialectContext();
  if (!sdk) {
    throw new Error('sdk not initialized');
  }
  return sdk;
};

export default useDialectSdk;
