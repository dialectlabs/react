import { useTheme } from '../providers/DialectThemeProvider';
import clsx from 'clsx';

export default function Divider(props: { className?: string }): JSX.Element {
  const { divider } = useTheme();

  return <div className={clsx(divider, props.className)} />;
}
