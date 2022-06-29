import { OnChain } from '../../../Icon';

const OnChainBadge = () => {
  return (
    <div className="dt-bg-on-chain dt-flex dt-space-x-0.5 dt-items-center dt-px-1 dt-rounded-sm dt-text-white dt-select-none">
      <OnChain className="dt-w-3 dt-h-3" /> <span>on-chain</span>
    </div>
  );
};

export default OnChainBadge;
