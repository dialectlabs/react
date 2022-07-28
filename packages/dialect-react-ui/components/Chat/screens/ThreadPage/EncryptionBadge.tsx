import clsx from 'clsx';
import { Encrypted, Unencrypted } from '../../../Icon';

type EncyptionBadgeProps = {
  enabled: boolean;
};

const EncryptionBadge = ({ enabled }: EncyptionBadgeProps) => {
  return (
    <div
      className={clsx('dt-flex dt-items-center dt-select-none')}
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
