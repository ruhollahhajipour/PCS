import { TextField, InputAdornment } from "@mui/material";

interface CurrencyFieldProps {
  label: string;

  value: number | "";

  onChange: (value: number | "") => void;

  currency?: string;

  required?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  helperText?: string;

  error?: boolean;
}

export default function CurrencyField({
  label,
  value,
  onChange,
  currency = "USD",
  required = false,
  disabled = false,
  fullWidth = true,
  helperText,
  error = false,
}: CurrencyFieldProps) {
  const handleChange = (
    input: string
  ) => {
    if (input === "") {
      onChange("");
      return;
    }

    const number = Number(input);

    if (!Number.isNaN(number)) {
      onChange(number);
    }
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
      onChange={(e) =>
        handleChange(e.target.value)
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {currency}
          </InputAdornment>
        ),
      }}
    />
  );
}