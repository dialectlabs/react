import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import Email from './Email';
import Sms from './Sms';
import Telegram from './Telegram';

export default function Settings() {
  const { xPaddedText } = useTheme();

  return (
    <div className={clsx('dt-py-2', xPaddedText)}>
      <div className="dt-mb-2">
        <Email />
      </div>
      <div className="dt-mb-2">
        <Sms />
      </div>
      <div className="dt-mb-2">
        <Telegram />
      </div>
    </div>
  );
}
