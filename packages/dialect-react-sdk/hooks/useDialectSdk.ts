import { useContext } from 'react';
import { DialectContext } from '../context/DialectContext';

const useDialectSdk = () => {
  const ctx = useContext(DialectContext);
  if (!ctx) {
    throw new Error('useDialectSdk must be used within a DialectContext');
  }
  return ctx.sdk;
};

export default useDialectSdk;
