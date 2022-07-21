import { useTheme } from '../providers/DialectThemeProvider';
import clsx from 'clsx';

export default function Loader(props: { className?: string }) {
  const { icons } = useTheme();
  return <icons.spinner className={clsx('dt-animate-spin', props.className)} />;
}
