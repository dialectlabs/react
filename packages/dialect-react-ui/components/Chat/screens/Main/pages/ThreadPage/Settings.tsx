import React from 'react';
import { display } from '@dialectlabs/web3';
import { useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { A, P } from '../../../../../common/preflighted';
import { useTheme } from '../../../../../common/ThemeProvider';
import { BigButton, ValueRow } from '../../../../../common';
import { getExplorerAddress } from '../../../../../../utils/getExplorerAddress';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface SettingsProps {
  onCloseRequest?: () => void;
}

const Settings = ({ onCloseRequest }: SettingsProps) => {
  const {
    dialectAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
    setDialectAddress,
  } = useDialect();
  const { colors, textStyles, icons } = useTheme();

  return (
    <>
      <div>
        {dialectAddress ? (
          <ValueRow
            label={
              <>
                <P className={clsx(textStyles.small, 'dt-opacity-60')}>
                  Notifications account address
                </P>
                <P>
                  <A
                    target="_blank"
                    href={getExplorerAddress(dialectAddress)}
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
        <BigButton
          className={colors.errorBg}
          onClick={async () => {
            await deleteDialect().catch(noop);
            // TODO: properly wait for the deletion
            onCloseRequest?.();
            setDialectAddress('');
          }}
          heading="Withdraw rent & delete history"
          description="Events history will be lost forever"
          icon={<icons.trash />}
          loading={isDialectDeleting}
        />
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
