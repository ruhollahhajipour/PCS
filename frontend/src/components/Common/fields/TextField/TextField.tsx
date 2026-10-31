import {
  TextField as MuiTextField,
} from "@mui/material";

interface TextFieldProps {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;

  required?: boolean;

  disabled?: boolean;

  multiline?: boolean;

  rows?: number;

  type?: string;

  fullWidth?: boolean;

  error?: boolean;

  helperText?: string;
}

export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  rows = 3,
  type = "text",
  fullWidth = true,
  error = false,
  helperText,
}: TextFieldProps) {
  return (
    <MuiTextField
      label={label}
      value={value}
      type={type}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      fullWidth={fullWidth}
      error={error}
      helperText={helperText}
      size="small"
      variant="outlined"
      onChange={(e) =>
        onChange(e.target.value)
      }
    />
  );
}