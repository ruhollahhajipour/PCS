import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";

export interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioGroupFieldProps {
  label: string;

  value: string | number;

  options: RadioOption[];

  onChange: (
    value: string | number
  ) => void;

  row?: boolean;

  disabled?: boolean;

  error?: boolean;

  helperText?: string;
}

export default function RadioGroupField({
  label,
  value,
  options,
  onChange,
  row = true,
  disabled = false,
  error = false,
  helperText,
}: RadioGroupFieldProps) {
  return (
    <FormControl
      error={error}
      disabled={disabled}
    >
      <FormLabel>
        {label}
      </FormLabel>

      <RadioGroup
        row={row}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        {options.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>

      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}