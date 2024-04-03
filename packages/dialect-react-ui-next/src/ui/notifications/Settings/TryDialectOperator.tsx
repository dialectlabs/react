import clsx from 'clsx';
import { TelegramIcon } from '../../core/icons';
import { Button } from '../../core/primitives';
import { ClassTokens } from '../../theme';

export const TryDialectOperator = () => {
  return (
    <div
      className={clsx(
        'dt-flex dt-flex-row dt-items-center dt-justify-between dt-gap-3 dt-pb-4',
      )}
    >
      <span
        className={clsx(
          ClassTokens.Text.Primary,
          'dt-text-text dt-font-semibold',
        )}
      >
        Try out Dialect Operator here
      </span>
      <Button>
        <TelegramIcon width={12} height={12} />
        <span>Try it out</span>
      </Button>
    </div>
  );
};
