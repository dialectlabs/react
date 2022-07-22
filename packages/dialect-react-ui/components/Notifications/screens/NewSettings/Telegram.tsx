import { IconButton, OutlinedInput } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';

const Telegram = () => {
  const { textStyles, icons } = useTheme();

  return (
    <div>
      <label
        htmlFor="settings-telegram"
        className={clsx(textStyles.label, 'dt-block dt-mb-1')}
      >
        Telegram
      </label>
      <OutlinedInput
        id="settings-telegram"
        placeholder="@"
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

export default Telegram;
