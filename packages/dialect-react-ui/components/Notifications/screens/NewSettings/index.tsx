import { IconButton, OutlinedInput } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';

export default function Settings() {
  const { xPaddedText, icons } = useTheme();

  return (
    <div className={clsx('dt-py-2', xPaddedText)}>
      <OutlinedInput
        placeholder="Testing"
        rightAdornment={
          <>
            <IconButton
              className="dt-bg-[#303030] dt-rounded-full dt-w-9 dt-h-9 dt-flex dt-items-center dt-justify-center"
              icon={<icons.checkmarkThin className="" />}
              onClick={() => {}}
            />
          </>
        }
      />
    </div>
  );
}
