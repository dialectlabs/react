import { Centered } from '../../common';
import React from 'react';
import { useTheme } from '../../common/ThemeProvider';

const NoConnection = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.notConnected className="dt-mb-6 dt-opacity-60" />
      <span className="dt-opacity-60">Wallet not connected</span>
    </Centered>
  );
};

export default NoConnection;
