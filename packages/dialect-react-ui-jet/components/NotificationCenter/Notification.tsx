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
    <div className="flex flex-col py-2">
      <div className="flex-1 mb-2">
        <p className={cs(TEXT_STYLES.body, 'font-medium text-base')}>
          {message}
        </p>
      </div>
      <div>
        <p className={cs(TEXT_STYLES.small, 'opacity-60')}>
          {timeFormatter.format(timestamp)}
        </p>
      </div>
    </div>
  );
};
