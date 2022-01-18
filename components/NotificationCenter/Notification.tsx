import React from 'react';

type Props = {
  title: string;
  message: string;
  timestamp: number;
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

export const Notification = ({ title, message, timestamp }: Props) => {
  return (
    <div className="flex flex-row border-b border-gray-500 py-2 px-4">
      <div className="flex-1 flex-col justify-between">
        <h4 className="font-bold text-black text-lg">{title}</h4>
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