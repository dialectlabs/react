import { display, isDialectAdmin } from '@dialectlabs/web3';
import { useApi, useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { getExplorerAddress } from '../../../../utils/getExplorerAddress';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Button, ValueRow } from '../../../common';
import { useChatInternal } from '../../provider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import type { ChatNavigationHelpers } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface SettingsProps {
  onCloseRequest?: () => void;
}

const Settings = ({ onCloseRequest }: SettingsProps) => {
  const { wallet, network } = useApi();
  const {
    dialect,
    dialectAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
    setDialectAddress,
  } = useDialect();
  const { textStyles, secondaryDangerButton, secondaryDangerButtonLoading } =
    useTheme();
  const isAdmin =
    dialect && wallet?.publicKey && isDialectAdmin(dialect, wallet.publicKey);
  const { dialectId } = useChatInternal();
  const { navigation } = useDialectUiId<ChatNavigationHelpers>(dialectId);

  return (
    <>
      <div>
        {dialectAddress ? (
          <ValueRow
            label={
              <>
                <P className={clsx(textStyles.small, 'dt-opacity-60')}>
                  Messages account address
                </P>
                <P>
                  <A
                    target="_blank"
                    href={getExplorerAddress(dialectAddress, network)}
                    rel="noreferrer"
                  >
                    {display(dialectAddress)}↗
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
              setDialectAddress('');
              navigation?.showMain();
            }}
            loading={isDialectDeleting}
          >
            Withdraw rent & delete history
          </Button>
        )}
        {deletionError && deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
          <P
            className={clsx(
              textStyles.small,
              'dt-text-red-500 dt-text-center dt-mt-2'
            )}
          >
            {deletionError.message}
          </P>
        )}
      </div>
    </>
  );
};

export default Settings;
