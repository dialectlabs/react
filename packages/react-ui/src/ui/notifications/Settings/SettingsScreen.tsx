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
      <Settings renderAdditionalSettingsUi={renderAdditionalSettingsUi} />
    </div>
  );
};
