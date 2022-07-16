import { useDialectGate } from '@dialectlabs/react-sdk';
import FailingGateError from '../../entities/errors/ui/FailingGateError';

interface GatedWrapperProps {
  children: JSX.Element;
  gatedView?: string | JSX.Element;
}

function GatedWrapper({ gatedView, children }: GatedWrapperProps) {
  const { isGatePassed, isGateLoading } = useDialectGate();

  if (!isGatePassed) {
    return !gatedView || typeof gatedView === 'string' ? (
      <FailingGateError message={gatedView} isLoading={isGateLoading} />
    ) : (
      gatedView
    );
  }

  return children;
}

export default GatedWrapper;
