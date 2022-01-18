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
    <div className="flex flex-col border-b border-gray-500 py-2 px-4">
      <div className="flex-1">
        <p className="text-black text-base">{message}</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">
          {timeFormatter.format(timestamp)}
        </p>
      </div>
    </div>
  );
}