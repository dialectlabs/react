import React from 'react';
import Linkify from 'react-linkify';
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
  const { colors, textStyles, notificationMessage, notificationTimestamp } =
    useTheme();
  return (
    <div className={cs('flex flex-col', colors.highlight, notificationMessage)}>
      <div className="flex-1 mb-2">
        <p className={cs(textStyles.body, 'font-medium text-base')}>
          <Linkify
            componentDecorator={(
              decoratedHref: string,
              decoratedText: string,
              key: string
            ) => (
              <a
                target="blank"
                className={textStyles.link}
                href={decoratedHref}
                key={key}
              >
                {decoratedText.length > 32
                  ? decoratedText.slice(0, 32) + '...'
                  : decoratedText}
              </a>
            )}
          >
            {message}
          </Linkify>
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
