import { Button } from '../../../core';

interface Props {
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onClick?: () => void;
}

export const ButtonAction = ({ onClick, disabled, label, loading }: Props) => {
  return (
    <Button
      size="medium"
      disabled={disabled}
      onClick={onClick}
      loading={loading}
    >
      {label}
    </Button>
  );
};
