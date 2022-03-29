import React from 'react';
import { display } from '@dialectlabs/web3';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../common/ThemeProvider';
import { BigButton, Divider, ValueRow } from '../common';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import cs from '../../utils/classNames';
import { A, P } from '../common/preflighted';

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
                <P className={cs(textStyles.small, 'dt-opacity-60')}>
                  Account address
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
              <P className={cs(textStyles.small, 'dt-opacity-60')}>
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
            props.toggleSettings();
            setDialectAddress('');
          }}
          heading="Withdraw rent & delete history"
          description="Events history will be lost forever"
          icon={<icons.trash />}
          loading={isDialectDeleting}
        />
        {deletionError && deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
          <P
            className={cs(
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
}
