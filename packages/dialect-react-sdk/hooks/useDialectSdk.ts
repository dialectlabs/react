import { useContext } from 'react';
import { DialectContext } from '../context/DialectContext';

const useDialectSdk = () => {
  const ctx = useContext(DialectContext);
  return ctx.sdk;
};

export default useDialectSdk;
