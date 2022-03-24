import React from 'react';
import { display } from '@dialectlabs/web3';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import { BigButton, ValueRow } from '../../../../../common';
import clsx from 'clsx';
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
                <p className={clsx(textStyles.small, 'opacity-60')}>
                  Account address
                </p>
                <p>
                  <a
                    target="_blank"
                    href={getExplorerAddress(dialectAddress)}
                    rel="noreferrer"
                  >
                    {display(dialectAddress)}↗
                  </a>
                </p>
              </>
            }
            className="mt-1 mb-4"
          >
            <div className="text-right">
              <p className={clsx(textStyles.small, 'opacity-60')}>
                Deposited Rent
              </p>
              <p>0.058 SOL</p>
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
          <p
            className={clsx(textStyles.small, 'text-red-500 text-center mt-2')}
          >
            {deletionError.message}
          </p>
        )}
      </div>
    </>
  );
};

export default Settings;
