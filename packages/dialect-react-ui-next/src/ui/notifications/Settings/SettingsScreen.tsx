import { Settings } from './Settings';
import { SettingsHeader } from './SettingsHeader';

export const SettingsScreen = () => {
  return (
    <div className="dt-flex dt-h-full dt-flex-col">
      <SettingsHeader />
      <section className="dt-overflow-y-scroll">
        <Settings />
      </section>
    </div>
  );
};
