import { useDialectContext } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ClassTokens } from '../../theme';
import { Button, ButtonType } from '../primitives';

const AppNotLoadedState = () => {
  const { app } = useDialectContext();

  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-items-center dt-justify-center dt-px-4">
      <h3
        className={clsx(
          'dt-pb-2 dt-pt-6 dt-text-h2 dt-font-semibold',
          ClassTokens.Text.Primary,
        )}
      >
        Failed to find app data
      </h3>
      <p
        className={clsx(
          'dt-pb-8 dt-text-center dt-text-text dt-font-normal',
          ClassTokens.Text.Secondary,
        )}
      >
        Please try pressing the button below, or report this to the app
        developer.
      </p>
      <Button
        type={ButtonType.Primary}
        size="large"
        onClick={() => app.refresh()}
      >
        Reload App Data
      </Button>
    </div>
  );
};

export default AppNotLoadedState;
