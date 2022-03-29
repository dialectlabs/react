import { Centered } from '../../common';
import React from 'react';
import { useTheme } from '../../common/ThemeProvider';

const NoConnection = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
      <span className="dt-opacity-60">
        Lost connection to Solana blockchain
      </span>
    </Centered>
  );
};

export default NoConnection;
