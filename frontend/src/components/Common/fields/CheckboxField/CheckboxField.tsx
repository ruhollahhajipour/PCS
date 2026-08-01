import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormGroup,
} from "@mui/material";

interface CheckboxFieldProps {
  label: string;

  checked: boolean;

  onChange: (checked: boolean) => void;

  disabled?: boolean;

  required?: boolean;

  error?: boolean;

  helperText?: string;
}

export default function CheckboxField({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
}: CheckboxFieldProps) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={(e) =>
              onChange(e.target.checked)
            }
          />
        }
        label={label}
        required={required}
      />

      {helperText && (
        <FormHelperText
          error={error}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormGroup>
  );
}