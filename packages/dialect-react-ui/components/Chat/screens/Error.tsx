import React from 'react';
import cs from '../../../utils/classNames';
import { Centered } from '../../common';
import { useTheme } from '../../common/ThemeProvider';
import IconButton from '../../IconButton';

type PropsType = {
  type: 'NoConnection' | 'NoWallet';
  onModalClose: () => void;
};

const Error = ({ type, onModalClose }: PropsType) => {
  const { header, icons } = useTheme();

  if (!type) return null;

  return (
    <>
      <div className="sm:dt-hidden">
        <div
          className={cs(
            'dt-flex dt-flex-row dt-items-center dt-justify-end',
            header
          )}
        >
          <div className="dt-ml-3">
            <IconButton icon={<icons.x />} onClick={onModalClose} />
          </div>
        </div>
      </div>
      {type === 'NoConnection' && (
        <Centered>
          <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
          <span className="dt-opacity-60">
            Lost connection to Solana blockchain
          </span>
        </Centered>
      )}
      {type === 'NoWallet' && (
        <Centered>
          <icons.notConnected className="dt-mb-6 dt-opacity-60" />
          <span className="dt-opacity-60">Wallet not connected</span>
        </Centered>
      )}
    </>
  );
};

export default Error;
