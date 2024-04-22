import clsx from 'clsx';
import { NotificationStyle } from '../../../../types';
import { TextButton } from '../../../core';
import { Icons } from '../../../theme';
import { getColor, getMessageURLTarget } from './utils';

interface LinkAction {
  styles: NotificationStyle;
  url: string;
  label?: string;
}

export const LinkAction = ({
  url,
  label = 'Open Link',
  styles,
}: LinkAction) => {
  return (
    <a
      href={url}
      target={getMessageURLTarget(url)}
      className={clsx(
        'dt-flex dt-flex-row dt-items-center dt-gap-0.5 dt-text-subtext dt-font-semibold',
      )}
      rel="noreferrer"
    >
      <TextButton color={getColor(styles.linkColor)}>
        {label}
        <Icons.ArrowRight width={12} height={12} />
      </TextButton>
    </a>
  );
};
