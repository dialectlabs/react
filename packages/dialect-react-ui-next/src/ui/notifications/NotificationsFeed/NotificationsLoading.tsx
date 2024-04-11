import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

export const NotificationsLoading = () => {
  return (
    <div className="dt-flex dt-h-full dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Loader width={24} height={24} />
      </div>

      <h3 className="dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold">
        Loading your notifications
      </h3>
    </div>
  );
};
