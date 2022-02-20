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
  const { dialectAddress, deleteDialect, isDialectDeleting, deletionError, setDialectAddress } =
    useDialect();
  const { colors, textStyles, icons } = useTheme();

  return (
    <>
      <div>
        <ValueRow label="Deposited Rent" className={cs('mb-1')}>
          0.058 SOL
        </ValueRow>
        <Divider />
        {dialectAddress ? (
          <>
            <ValueRow
              label="Notifications thread account"
              className="mt-1 mb-4"
            >
              <a
                target="_blank"
                href={getExplorerAddress(dialectAddress)}
                rel="noreferrer"
              >
                {display(dialectAddress)}↗
              </a>
            </ValueRow>
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
            {deletionError &&
              deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
                <p
                  className={cs(
                    textStyles.small,
                    'text-red-500 text-center mt-2'
                  )}
                >
                  {deletionError.message}
                </p>
              )}
          </>
        ) : null}
      </div>
    </>
  );
}