import { useState } from 'react';
import { EMPTY_ARR } from '../../../utils';
import { createContainer } from '../../../utils/container';

interface DialectBackendConnectionInfo {
  connected: boolean;
}

export interface DialectConnectionInfo {
  dialectCloud: DialectBackendConnectionInfo;
}

export interface DialectConnectionInfoState {
  connectionInfo: DialectConnectionInfo;

  // _updateConnectionInfo(
  //   fn: (prevInfo: DialectConnectionInfo) => DialectConnectionInfo
  // ): void;
}
//TODO: should use some kind of health checks
function useDialectConnectionInfo(): DialectConnectionInfoState {
  const [connectionInfo, setConnectionInfo] = useState<DialectConnectionInfo>(
    () => ({
      dialectCloud: {
        connected: true,
      },
    })
  );

  return {
    connectionInfo,
    // _updateConnectionInfo: setConnectionInfo,
  };
}

export const DialectConnectionInfo = createContainer(useDialectConnectionInfo);
