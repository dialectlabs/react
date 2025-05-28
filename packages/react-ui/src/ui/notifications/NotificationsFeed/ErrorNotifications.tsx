import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

export const ErrorNotifications = () => {
  return (
    <div className="dt-flex dt-h-full dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Close width={24} height={24} />
      </div>

      <h3
        className={clsx(
          'dt-pb-3 dt-pt-6 dt-text-center dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        Failed to fetch notifications.
      </h3>

      <p
        className={clsx(
          'dt-mb-6 dt-text-center dt-text-text dt-font-normal',
          ClassTokens.Text.Secondary,
        )}
      >
        Please try again later, or reach out to the development team.
      </p>
    </div>
  );
};
