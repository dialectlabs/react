import React from 'react';
import cs from '../../utils/classNames';
import { TEXT_STYLES } from '../common';

type Props = {
  message: string;
  timestamp: number;
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const Notification = ({ message, timestamp }: Props) => {
  return (
    <div className="flex flex-col border-b py-2">
      <div className="flex-1 mb-1">
        <p className={cs(TEXT_STYLES.medium13, 'text-base')}>{message}</p>
      </div>
      <div>
        <p className={cs(TEXT_STYLES.regular13, 'opacity-60')}>
          {timeFormatter.format(timestamp)}
        </p>
      </div>
    </div>
  );
};
