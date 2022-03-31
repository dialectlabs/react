import React from 'react';
import Linkify from 'react-linkify';
import cs from '../../utils/classNames';
import { A, P } from '../common/preflighted';
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
    <div
      className={cs(
        'dt-flex dt-flex-col',
        colors.highlight,
        notificationMessage
      )}
    >
      <div className="dt-flex-1 dt-mb-2">
        <P className={cs(textStyles.body, 'dt-font-medium dt-text-base')}>
          <Linkify
            componentDecorator={(
              decoratedHref: string,
              decoratedText: string,
              key: number
            ) => (
              <A
                target="blank"
                className={textStyles.link}
                href={decoratedHref}
                key={key}
              >
                {decoratedText.length > 32
                  ? decoratedText.slice(0, 32) + '...'
                  : decoratedText}
              </A>
            )}
          >
            {message}
          </Linkify>
        </P>
      </div>
      <div className={notificationTimestamp}>
        <P className={cs(textStyles.small, 'dt-opacity-60')}>
          {timeFormatter.format(timestamp)}
        </P>
      </div>
    </div>
  );
};
