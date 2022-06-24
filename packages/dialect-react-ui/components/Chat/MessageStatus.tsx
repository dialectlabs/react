import { useTheme } from '../common/providers/DialectThemeProvider';

export default function MessageStatus(props: {
  isSending?: boolean;
  error?: string | null;
}) {
  const { icons } = useTheme();
  if (props.isSending) {
    return (
      <div className="dt-w-4 dt-h-4 dt-flex dt-items-center dt-justify-center dt-rounded-full dt-border-2 dt-border-current"></div>
    );
  }

  if (props.error) {
    return (
      <div
        className="dt-w-4 dt-h-4 dt-flex dt-items-center dt-justify-center dt-rounded-full dt-border-2 dt-border-red-500"
        title={props.error}
      >
        <icons.error />
      </div>
    );
  }

  return (
    <div className="dt-w-4 dt-h-4 dt-flex dt-items-center dt-justify-center dt-rounded-full dt-border-2 dt-border-current">
      <icons.checkmark />
    </div>
  );
}
