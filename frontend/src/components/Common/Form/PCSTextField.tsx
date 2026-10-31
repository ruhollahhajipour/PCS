import TextField from "@mui/material/TextField";

export interface PCSTextFieldProps {
  label: string;
  name: string;

  value: string | number;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  required?: boolean;

  type?: string;

  multiline?: boolean;

  rows?: number;

  disabled?: boolean;
}

export default function PCSTextField({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
  multiline = false,
  rows = 1,
  disabled = false,
}: PCSTextFieldProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"

      label={label}

      name={name}

      value={value}

      onChange={onChange}

      required={required}

      type={type}

      multiline={multiline}

      rows={rows}

      disabled={disabled}

      size="small"
    />
  );
}