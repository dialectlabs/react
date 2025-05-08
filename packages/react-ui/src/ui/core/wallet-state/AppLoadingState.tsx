import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

const AppLoadingState = () => {
  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <div className={clsx(ClassTokens.Icon.Secondary)}>
        <Icons.Loader width={24} height={24} />
      </div>

      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        Loading App Data
      </h3>
      <p
        className={clsx(
          'dt-text-center dt-text-text dt-font-normal',
          ClassTokens.Text.Secondary,
        )}
      >
        Please wait, this shouldn&apos;t take long.
      </p>
    </div>
  );
};

export default AppLoadingState;
