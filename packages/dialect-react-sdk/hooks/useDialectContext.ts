import { useContext } from 'react';
import { DialectContext, DialectContextType } from '../context/DialectContext';

const useDialectContext = (): DialectContextType => {
  const ctx = useContext(DialectContext);
  if (!ctx) {
    throw new Error('useDialectContext must be used within a DialectContext');
  }
  return ctx;
};

export default useDialectContext;
