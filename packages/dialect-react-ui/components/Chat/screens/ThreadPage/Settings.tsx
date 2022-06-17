import { display } from '@dialectlabs/web3';
import { useApi } from '@dialectlabs/react';
import { ThreadMemberScope } from '@dialectlabs/sdk';
import clsx from 'clsx';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Button, ValueRow } from '../../../common';
import useMemoThread from '../../../../hooks/useMemoThread';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface SettingsProps {
  threadId: string;
  onCloseRequest?: () => void;
}

const Settings = ({ threadId, onCloseRequest }: SettingsProps) => {
  const { network } = useApi();
  const {
    thread,
    delete: deleteDialect,
    isDeletingThread,
    errorDeletingThread,
  } = useMemoThread(threadId);
  // const {
  //   dialect,
  //   dialectAddress,
  //   deleteDialect,
  //   isDialectDeleting,
  //   deletionError,
  //   setDialectAddress,
  // } = useDialect();

  const { textStyles, secondaryDangerButton, secondaryDangerButtonLoading } =
    useTheme();
  const isAdmin = thread?.me?.scopes?.find(
    (scope) => scope === ThreadMemberScope.ADMIN
  );

  return (
    <>
      <div>
        {thread ? (
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
                      thread.address.toBase58(),
                      network
                    )}
                    rel="noreferrer"
                  >
                    {display(thread.address)}↗
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
        {isAdmin && (
          <Button
            className="dt-w-full"
            defaultStyle={secondaryDangerButton}
            loadingStyle={secondaryDangerButtonLoading}
            onClick={async () => {
              await deleteDialect().catch(noop);
              // TODO: properly wait for the deletion
              onCloseRequest?.();
            }}
            loading={isDeletingThread}
          >
            Withdraw rent & delete history
          </Button>
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
