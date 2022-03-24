import { Centered } from '../../common';
import React from 'react';
import { useTheme } from '../../common/ThemeProvider';

const NoConnection = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.notConnected className="mb-6 opacity-60" />
      <span className="opacity-60">Wallet not connected</span>
    </Centered>
  );
};

export default NoConnection;
