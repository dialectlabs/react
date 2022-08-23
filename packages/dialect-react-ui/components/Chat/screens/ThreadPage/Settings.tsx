import {
  Backend,
  ThreadId,
  useDialectSdk,
  useThread,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';
import { Button, ValueRow } from '../../../common';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName } from '../../constants';
import { useChatInternal } from '../../provider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import type { ChatNavigationHelpers } from '../../types';
import { shortenAddress } from '../../../../utils/displayUtils';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface SettingsProps {
  threadId: ThreadId;
}

const Settings = ({ threadId }: SettingsProps) => {
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
  const { navigate } = useRoute();

  const { textStyles, secondaryDangerButton, secondaryDangerButtonLoading } =
    useTheme();
  const isOnChain = thread?.backend === Backend.Solana;
  const { dialectId } = useChatInternal();
  const { navigation } = useDialectUiId<ChatNavigationHelpers>(dialectId);

  return (
    <>
      <div className="dt-pt-1">
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
                    {shortenAddress(thread.id.address)}↗
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
          <Button
            className="dt-w-full"
            defaultStyle={secondaryDangerButton}
            loadingStyle={secondaryDangerButtonLoading}
            onClick={async () => {
              await deleteDialect().catch(noop);
              navigate(RouteName.Main, {
                sub: { name: MainRouteName.Thread },
              });
              navigation?.showMain();
            }}
            loading={isDeletingThread}
          >
            {isOnChain ? 'Withdraw rent & delete history' : 'Delete thread'}
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
