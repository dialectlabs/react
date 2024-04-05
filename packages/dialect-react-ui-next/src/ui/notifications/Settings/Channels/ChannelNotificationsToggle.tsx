import clsx from 'clsx';
import { Switch } from '../../../core/primitives';
import { ClassTokens } from '../../../theme';
interface Props {
  enabled: boolean;
  onChange: (newValue: boolean) => void;
}
export const ChannelNotificationsToggle = ({ enabled, onChange }: Props) => (
  <div className="dt-flex dt-flex-row dt-items-center dt-gap-2">
    <Switch checked={enabled} onChange={onChange} />
    <p
      className={clsx(
        'dt-text-subtext dt-font-semibold',
        ClassTokens.Text.Secondary,
      )}
    >
      Notifications {enabled ? 'On' : 'Off'}
    </p>
  </div>
);
