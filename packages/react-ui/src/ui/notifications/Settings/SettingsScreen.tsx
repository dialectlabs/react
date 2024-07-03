import { ReactNode } from 'react';
import { Settings } from './Settings';
import { SettingsHeader } from './SettingsHeader';

export const SettingsScreen = ({
  renderAdditionalSettingsUi,
}: {
  renderAdditionalSettingsUi?: (args: Record<string, never>) => ReactNode;
}) => {
  return (
    <div className="dt-flex dt-h-full dt-flex-col">
      <SettingsHeader />
      <section className="dt-h-full dt-overflow-y-scroll">
        <Settings renderAdditionalSettingsUi={renderAdditionalSettingsUi} />
      </section>
    </div>
  );
};
