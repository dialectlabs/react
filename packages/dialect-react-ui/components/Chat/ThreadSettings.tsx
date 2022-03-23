import React from 'react';
import { display } from '@dialectlabs/web3';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../common/ThemeProvider';
import { BigButton, Divider, ValueRow } from '../common';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import cs from '../../utils/classNames';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export default function Settings(props: { toggleSettings: () => void }) {
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
                <p className={cs(textStyles.small, 'opacity-60')}>
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
              <p className={cs(textStyles.small, 'opacity-60')}>
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
            props.toggleSettings();
            setDialectAddress('');
          }}
          heading="Withdraw rent & delete history"
          description="Events history will be lost forever"
          icon={<icons.trash />}
          loading={isDialectDeleting}
        />
        {deletionError && deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
          <p className={cs(textStyles.small, 'text-red-500 text-center mt-2')}>
            {deletionError.message}
          </p>
        )}
      </div>
    </>
  );
}
