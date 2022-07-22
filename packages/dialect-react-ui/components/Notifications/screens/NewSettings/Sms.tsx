import { IconButton, OutlinedInput } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';

const Sms = () => {
  const { textStyles, icons } = useTheme();

  return (
    <div>
      <label
        htmlFor="settings-sms"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Phone
      </label>
      <OutlinedInput
        id="settings-sms"
        placeholder="+15554443333 (+1 required, US only)"
        type="tel"
        rightAdornment={
          <IconButton
            className="dt-bg-[#303030] dt-rounded-full dt-w-9 dt-h-9 dt-flex dt-items-center dt-justify-center"
            icon={<icons.checkmarkThin />}
            onClick={() => {}}
          />
        }
      />
    </div>
  );
};

export default Sms;
