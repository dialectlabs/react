import clsx from 'clsx';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Encrypted, Unencrypted } from '../../../Icon';

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
        'dt-flex dt-items-center dt-px-1 dt-py-0.5 dt-rounded-sm dt-select-none',
        highlight
      )}
      title={enabled ? 'encrypted' : 'unencrypted'}
    >
      {enabled ? (
        <Encrypted className="dt-w-3 dt-h-3" />
      ) : (
        <Unencrypted className="dt-w-3 dt-h-3" />
      )}
    </div>
  );
};

export default EncryptionBadge;
