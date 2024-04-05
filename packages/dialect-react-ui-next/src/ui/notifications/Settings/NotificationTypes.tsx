import clsx from 'clsx';
import { useState } from 'react';
import { Switch } from '../../core/primitives';
import { ClassTokens } from '../../theme';

interface Props {
  title: string;
  description?: string;
  enabled: boolean;
  onSwitch: () => void;
}

const NotificationType = ({ title, description, enabled, onSwitch }: Props) => {
  const [isEnabled, setEnabled] = useState(enabled);
  return (
    <div
      className={clsx(
        ClassTokens.Background.Secondary,
        'dt-flex dt-flex-row dt-items-center dt-justify-between dt-gap-3 dt-rounded-xl dt-px-4 dt-py-3',
      )}
    >
      <div className="dt-flex dt-flex-col dt-gap-1">
        <span
          className={clsx(
            ClassTokens.Text.Primary,
            'dt-text-text dt-font-semibold',
          )}
        >
          {title}
        </span>
        {description && (
          <span
            className={clsx(
              ClassTokens.Text.Tertiary,
              'dt-text-subtext dt-font-medium',
            )}
          >
            {description}
          </span>
        )}
      </div>
      {/*TODO checkbox */}
      <Switch checked={isEnabled} onChange={(next) => setEnabled(next)} />
    </div>
  );
};

export const NotificationTypes = () => {
  const types = [
    {
      id: '1',
      title: 'Price Action',
      description: 'Price change alerts for your open contracts.',
    },
    {
      id: '2',
      title: 'Stop Loss and Profit Takes',
      description: 'Alerts when your Stop Loss or Take Profit orders fill.',
    },
  ];

  return (
    <div className="dt-flex dt-flex-col dt-gap-2 dt-py-4">
      {types.map((it) => (
        <NotificationType
          key={it.id}
          title={it.title}
          description={it.description}
          enabled={true}
          onSwitch={() => {}}
        />
      ))}
    </div>
  );
};
