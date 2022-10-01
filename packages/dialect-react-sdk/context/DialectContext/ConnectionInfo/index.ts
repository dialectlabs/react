import { useState } from 'react';
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
  const [connectionInfo] = useState<DialectConnectionInfo>(() => ({
    dialectCloud: {
      connected: true,
    },
  }));

  return {
    connectionInfo,
    // _updateConnectionInfo: setConnectionInfo,
  };
}

export const DialectConnectionInfo = createContainer(useDialectConnectionInfo);
