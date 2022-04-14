import React from 'react';
import { display } from '@dialectlabs/web3';
import { useApi, useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { getExplorerAddress } from '../../../../../../utils/getExplorerAddress';
import { A, P } from '../../../../../common/preflighted';
import { useTheme } from '../../../../../common/ThemeProvider';
import { Button, ValueRow } from '../../../../../common';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface SettingsProps {
  onCloseRequest?: () => void;
}

const Settings = ({ onCloseRequest }: SettingsProps) => {
  const { network } = useApi();
  const {
    dialectAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
    setDialectAddress,
  } = useDialect();
  const { textStyles, secondaryDangerButton, secondaryDangerButtonLoading } =
    useTheme();

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
        <Button
          className="dt-w-full"
          defaultStyle={secondaryDangerButton}
          loadingStyle={secondaryDangerButtonLoading}
          onClick={async () => {
            await deleteDialect().catch(noop);
            // TODO: properly wait for the deletion
            onCloseRequest?.();
            setDialectAddress('');
          }}
          loading={isDialectDeleting}
        >
          Withdraw rent & delete history
        </Button>
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
