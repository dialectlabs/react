import clsx from 'clsx';
import { ClassTokens } from '../../theme';
import { AppInfo } from './AppInfo';
import { Channels } from './Channels';
import { NotificationTypes } from './NotificationTypes';
import { TosAndPrivacy } from './TosAndPrivacy';
import { TryDialectOperator } from './TryDialectOperator';

export const Settings = () => {
  return (
    <div>
      <div className="dt-px-4">
        <Channels channels={['wallet', 'telegram', 'email']} />
      </div>
      <div className={clsx('dt-border-t dt-px-4', ClassTokens.Stroke.Primary)}>
        <NotificationTypes />
      </div>
      <div className="dt-px-4">
        <TryDialectOperator />
      </div>
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-gap-2 dt-border-t dt-px-4 dt-py-4',
          ClassTokens.Stroke.Primary,
        )}
      >
        <TosAndPrivacy />
        <AppInfo />
      </div>
    </div>
  );
};
