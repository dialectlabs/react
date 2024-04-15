import clsx from 'clsx';
import { Button } from '../../core';
import { TelegramIcon } from '../../core/icons';
import { ClassTokens } from '../../theme';

export const TryDialectOperator = () => {
  return (
    <div
      className={clsx(
        'dt-flex dt-flex-row dt-items-center dt-justify-between dt-gap-3',
      )}
    >
      <span
        className={clsx(
          ClassTokens.Text.Primary,
          'dt-text-text dt-font-semibold',
        )}
      >
        Try out Dialect Operator
      </span>
      <a href="https://t.me/dialectbot" target="_blank" rel="noreferrer">
        <Button>
          <TelegramIcon width={12} height={12} />
          <span>Try it out</span>
        </Button>
      </a>
    </div>
  );
};
