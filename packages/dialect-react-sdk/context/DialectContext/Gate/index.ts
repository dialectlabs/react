import { useCallback, useEffect, useState } from 'react';
import { createContainer } from '../../../utils/container';

export type Gate = () => boolean | Promise<boolean>;

const PASSING_GATE = () => true;

export interface DialectGateState {
  isGatePassed: boolean;
  isGateLoading: boolean;
}

function useDialectGate(gate: Gate = PASSING_GATE): DialectGateState {
  const [isGateLoading, setIsGateLoading] = useState(false);
  const [isGatePassed, setIsGatePassed] = useState(false);

  const gateWrapper = useCallback(async () => {
    setIsGateLoading(true);
    try {
      const gateRes = await gate();
      setIsGatePassed(gateRes);
      return gateRes;
    } catch {
      setIsGatePassed(false);
    } finally {
      setIsGateLoading(false);
    }
  }, [gate]);

  useEffect(
    function verifyGate() {
      gateWrapper();
    },
    [gateWrapper]
  );

  return {
    isGatePassed,
    isGateLoading,
  };
}

export const DialectGate = createContainer(useDialectGate);
