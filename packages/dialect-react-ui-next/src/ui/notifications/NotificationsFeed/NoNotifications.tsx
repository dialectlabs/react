import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

export const NoNotifications = () => {
  return (
    <div className="dt-flex dt-h-full dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Bell width={24} height={24} />
      </div>

      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        You don’t have any notifications yet
      </h3>
    </div>
  );
};
