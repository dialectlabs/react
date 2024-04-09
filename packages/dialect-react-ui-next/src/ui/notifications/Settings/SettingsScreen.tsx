import { Settings } from './Settings';
import { SettingsHeader } from './SettingsHeader';

export const SettingsScreen = () => {
  return (
    <div className="dt-flex dt-flex-col">
      <SettingsHeader />
      <Settings />
    </div>
  );
};
