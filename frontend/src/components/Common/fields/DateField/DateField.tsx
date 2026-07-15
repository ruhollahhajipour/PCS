import { TextField } from "@mui/material";

interface DateFieldProps {
  label: string;

  value: string;

  onChange: (value: string) => void;

  required?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  error?: boolean;

  helperText?: string;

  min?: string;

  max?: string;
}

export default function DateField({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  fullWidth = true,
  error = false,
  helperText,
  min,
  max,
}: DateFieldProps) {
  return (
    <TextField
      label={label}
      type="date"
      value={value}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      size="small"
      error={error}
      helperText={helperText}
      onChange={(e) =>
        onChange(e.target.value)
      }
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        min,
        max,
      }}
    />
  );
}