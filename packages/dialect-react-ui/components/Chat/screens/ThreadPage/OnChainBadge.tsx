import clsx from 'clsx';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { OnChain } from '../../../Icon';

const OnChainBadge = () => {
  const {
    colors: { highlight },
  } = useTheme();
  return (
    <div
      className={clsx(
        'dt-flex dt-items-center dt-px-1 dt-py-0.5 dt-rounded-sm dt-select-none',
        highlight
      )}
      title="Messages stored on-chain"
    >
      <OnChain className="dt-w-3 dt-h-3" />
    </div>
  );
};

export default OnChainBadge;
