import { Switch } from '../../../core/primitives';

interface Props {
  enabled: boolean;
  onChange: (newValue: boolean) => void;
}
export const ChannelNotificationsToggle = ({ enabled, onChange }: Props) => (
  <Switch
    checked={enabled}
    onChange={onChange}
  >{`Notifications ${enabled ? 'On' : 'Off'}`}</Switch>
);
