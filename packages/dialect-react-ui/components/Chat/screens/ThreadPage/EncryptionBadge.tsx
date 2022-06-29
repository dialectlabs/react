import clsx from 'clsx';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Lock, NoLock } from '../../../Icon';

type EncyptionBadgeProps = {
  enabled: boolean;
};

const EncryptionBadge = ({ enabled }: EncyptionBadgeProps) => {
  const {
    colors: { highlight },
  } = useTheme();
  return (
    <div
      className={clsx(
        'dt-flex dt-items-center dt-px-1 dt-rounded-sm dt-space-x-0.5 dt-select-none',
        highlight
      )}
    >
      {enabled ? (
        <>
          <Lock className="dt-w-3 dt-h-3 dt-mt-0.5" /> <span>encrypted</span>
        </>
      ) : (
        <>
          <NoLock className="dt-w-3 dt-h-3 dt-mt-0.5" />{' '}
          <span>unencrypted</span>
        </>
      )}
    </div>
  );
};

export default EncryptionBadge;
