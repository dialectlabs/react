import { Centered } from '../../common';
import React from 'react';
import { useTheme } from '../../common/ThemeProvider';

const NoConnection = () => {
  const { icons } = useTheme();

  return (
    <Centered>
      <icons.offline className="w-10 mb-6 opacity-60" />
      <span className="opacity-60">Lost connection to Solana blockchain</span>
    </Centered>
  );
};

export default NoConnection;
