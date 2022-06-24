import {
  Backend,
  ThreadId,
  useDialectSdk,
  useThread,
} from '@dialectlabs/react-sdk';
import { display } from '@dialectlabs/web3';
import clsx from 'clsx';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';
import { Button, ValueRow } from '../../../common';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface SettingsProps {
  threadId: ThreadId;
  onThreadDeleted: () => void;
}

const Settings = ({ threadId, onThreadDeleted }: SettingsProps) => {
  const {
    info: {
      config: { solana },
    },
  } = useDialectSdk();
  const {
    thread,
    delete: deleteDialect,
    isAdminable,
    isDeletingThread,
    errorDeletingThread,
  } = useThread({ findParams: { id: threadId } });

  const {
    textStyles,
    xPaddedText,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
  } = useTheme();
  const isOnChain = thread?.backend === Backend.Solana;

  return (
    <>
      <div>
        {isOnChain ? (
          <ValueRow
            label={
              <>
                <P className={clsx(textStyles.small, 'dt-opacity-60')}>
                  Messages account address
                </P>
                <P>
                  <A
                    target="_blank"
                    href={getExplorerAddress(
                      thread.id.address.toBase58(),
                      solana?.network
                    )}
                    rel="noreferrer"
                  >
                    {display(thread.id.address)}↗
                  </A>
                </P>
              </>
            }
            className="dt-mt-1 dt-mb-4"
          >
            <div className="dt-text-right">
              <P className={clsx(textStyles.small, 'dt-opacity-60')}>
                Deposited Rent
              </P>
              <P>0.058 SOL</P>
            </div>
          </ValueRow>
        ) : null}
        {isAdminable && (
          <>
            <Button
              className="dt-w-full"
              defaultStyle={secondaryDangerButton}
              loadingStyle={secondaryDangerButtonLoading}
              onClick={async () => {
                await deleteDialect().catch(noop);
                onThreadDeleted?.();
              }}
              loading={isDeletingThread}
            >
              {isOnChain ? 'Withdraw rent and delete history' : 'Delete thread'}
            </Button>
            <P
              className={clsx(
                textStyles.small,
                xPaddedText,
                'dt-opacity-50 dt-mt-2'
              )}
            >
              Notification history will be lost forever
            </P>
          </>
        )}
        {errorDeletingThread &&
          errorDeletingThread.type !== 'DISCONNECTED_FROM_CHAIN' && (
            <P
              className={clsx(
                textStyles.small,
                'dt-text-red-500 dt-text-center dt-mt-2'
              )}
            >
              {errorDeletingThread.message}
            </P>
          )}
      </div>
    </>
  );
};

export default Settings;
