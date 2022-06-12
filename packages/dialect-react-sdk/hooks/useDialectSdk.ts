import type { DialectSdk } from '@dialectlabs/sdk';
import useDialectContext from './useDialectContext';

const useDialectSdk = (): DialectSdk => {
  const { sdk } = useDialectContext();
  return sdk;
};

export default useDialectSdk;
