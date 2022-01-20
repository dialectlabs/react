import React from 'react';

type Props = {
  message: string;
  timestamp: number;
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});

export const Notification = ({ message, timestamp }: Props) => {
  return (
    <div className="flex flex-col border-b border-th-bkg-3 py-2">
      <div className="flex-1">
        <p className="text-base text-th-fgd-1 mt-3">{message}</p>
      </div>
      <div>
        <p className="text-th-fgd-4 text-xs">
          {timeFormatter.format(timestamp)}
        </p>
      </div>
    </div>
  );
}
