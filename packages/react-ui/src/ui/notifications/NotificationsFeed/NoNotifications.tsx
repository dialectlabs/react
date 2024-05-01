import clsx from 'clsx';
import { Button, ButtonType } from '../../core';
import { ClassTokens, Icons } from '../../theme';
import { Route, useRouter } from '../internal/Router';

export const NoNotifications = () => {
  const router = useRouter();

  return (
    <div className="dt-flex dt-h-full dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Bell width={24} height={24} />
      </div>

      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-center dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        You don’t have any notifications yet
      </h3>

      <p
        className={clsx(
          'dt-mb-6 dt-text-center dt-text-text dt-font-normal',
          ClassTokens.Text.Secondary,
        )}
      >
        Enable your wallet to receive notifications.
      </p>

      <Button
        type={ButtonType.Primary}
        size="large"
        stretch={true}
        onClick={() => router.setRoute(Route.Settings)}
      >
        <Icons.Settings /> Set up notifications
      </Button>
    </div>
  );
};
