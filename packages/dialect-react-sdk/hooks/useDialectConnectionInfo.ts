import {
  DialectConnectionInfo,
  DialectConnectionInfoState,
} from '../context/DialectContext/ConnectionInfo';

const useDialectConnectionInfo = (): Omit<
  DialectConnectionInfoState,
  '_updateConnectionInfo'
> => {
  const connectionInfo = DialectConnectionInfo.useContainer();
  return connectionInfo;
};

export default useDialectConnectionInfo;
