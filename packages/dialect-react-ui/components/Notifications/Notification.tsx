import React from 'react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';

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
  const { textStyles, notificationBubble, notificationTimestamp } = useTheme();
  return (
    <div className={cs('flex flex-col', notificationBubble)}>
      <div className="flex-1 mb-2">
        <p className={cs(textStyles.body, 'font-medium text-base')}>
          {message}
        </p>
      </div>
      <div className={notificationTimestamp}>
        <p className={cs(textStyles.small, 'opacity-60')}>
          {timeFormatter.format(timestamp)}
        </p>
      </div>
    </div>
  );
};
