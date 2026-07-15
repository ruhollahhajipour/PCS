import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";

export interface SelectOption {
  value: string | number;

  label: string;
}

interface SelectFieldProps {
  label: string;

  value: string | number;

  options: SelectOption[];

  onChange: (
    value: string | number
  ) => void;

  required?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  error?: boolean;

  helperText?: string;
}

export default function SelectField({
  label,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
  fullWidth = true,
  error = false,
  helperText,
}: SelectFieldProps) {
  return (
    <FormControl
      fullWidth={fullWidth}
      size="small"
      required={required}
      disabled={disabled}
      error={error}
    >
      <InputLabel>
        {label}
      </InputLabel>

      <Select
        value={value}
        label={label}
        onChange={(e) =>
          onChange(
            e.target.value as
              | string
              | number
          )
        }
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}