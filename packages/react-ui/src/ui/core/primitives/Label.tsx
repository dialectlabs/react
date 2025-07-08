import clsx from 'clsx';
import { DetailedHTMLProps, LabelHTMLAttributes } from 'react';
import { ClassTokens } from '../../theme';

export const Label = ({
  className,
  ...props
}: DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>) => {
  return (
    <label
      className={clsx(
        'dt-label dt-text-label',
        ClassTokens.Text.Primary,
        className,
      )}
      {...props}
    />
  );
};
