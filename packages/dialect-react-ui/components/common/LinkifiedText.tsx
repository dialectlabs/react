import type React from 'react';
import Linkify from 'react-linkify';
import { A } from './preflighted';
import { useTheme } from './providers/DialectThemeProvider';

// Similar to twitter
const MAX_LINK_TEXT_LENGTH = 32;

export default function LinkifiedText({
  children,
}: {
  children: React.ReactNode;
}) {
  const { textStyles } = useTheme();
  return (
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
          {decoratedText.length > MAX_LINK_TEXT_LENGTH
            ? decoratedText.slice(0, MAX_LINK_TEXT_LENGTH) + '...'
            : decoratedText}
        </A>
      )}
    >
      {children}
    </Linkify>
  );
}
