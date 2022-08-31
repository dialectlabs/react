import clsx from 'clsx';
import { Button, ButtonLink, Loader } from '../common';
import { P } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';

interface SubscribeRowProps {
  label: string;
  isSubscribed: boolean;
  isLoading: boolean;
  onOpenMoreOptions?: () => void;
  onSubscribe: () => void;
}

const SubscribeRow = ({
  label,
  onOpenMoreOptions,
  onSubscribe,
  isSubscribed,
  isLoading,
}: SubscribeRowProps) => {
  const { textStyles, outlinedInput, button } = useTheme();

  return (
    <div>
      <div
        className={clsx(
          'dt-flex dt-items-center dt-border !dt-bg-transparent',
          outlinedInput
        )}
      >
        <div
          className={clsx(
            'dt-w-full dt-bg-transparent dt-outline-0',
            textStyles.input
          )}
        >
          <div className="dt-flex dt-justify-between dt-items-center">
            <span className={'dt-opacity-40'}>{label}</span>
            {!isLoading && isSubscribed ? <span>✓ Subscribed</span> : null}
            {!isLoading && !isSubscribed ? (
              <Button onClick={onSubscribe} className={clsx(button, 'dt-h-9')}>
                Subscribe
              </Button>
            ) : null}

            {isLoading && (
              <div
                className={
                  'dt-h-9 dt-w-9 dt-rounded-full dt-flex dt-items-center dt-justify-center dt-text-white dt-text-xs dt-border-0 dt-opactity-60'
                }
              >
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={clsx(
          !isSubscribed && 'dt-opacity-0 dt-pointer-events-none',
          'dt-flex dt-flex-row dt-space-x-2 dt-items-center dt-mt-1'
        )}
      >
        <P className={'dt-px-4 dt-text-xs dt-opacity-60'}>
          <ButtonLink onClick={onOpenMoreOptions}>Other options</ButtonLink>
        </P>
      </div>
    </div>
  );
};

export default SubscribeRow;
