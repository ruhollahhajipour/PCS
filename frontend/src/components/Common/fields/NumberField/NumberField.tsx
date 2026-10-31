import { TextField } from "@mui/material";

interface NumberFieldProps {
  label: string;

  value: number | "";

  onChange: (value: number | "") => void;

  min?: number;

  max?: number;

  step?: number;

  required?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  helperText?: string;

  error?: boolean;
}

export default function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  required = false,
  disabled = false,
  fullWidth = true,
  helperText,
  error = false,
}: NumberFieldProps) {
  const handleChange = (
    input: string
  ) => {
    if (input === "") {
      onChange("");
      return;
    }

    const number = Number(input);

    if (Number.isNaN(number)) return;

    if (min !== undefined && number < min)
      return;

    if (max !== undefined && number > max)
      return;

    onChange(number);
  };

  return (
    <TextField
      label={label}
      type="number"
      value={value}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      size="small"
      error={error}
      helperText={helperText}
      inputProps={{
        min,
        max,
        step,
      }}
      onChange={(e) =>
        handleChange(e.target.value)
      }
    />
  );
}