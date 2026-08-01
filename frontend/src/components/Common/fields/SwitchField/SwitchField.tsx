import {
  FormControlLabel,
  Switch,
  FormHelperText,
  FormGroup,
} from "@mui/material";

interface SwitchFieldProps {
  label: string;

  checked: boolean;

  onChange: (checked: boolean) => void;

  disabled?: boolean;

  helperText?: string;

  error?: boolean;
}

export default function SwitchField({
  label,
  checked,
  onChange,
  disabled = false,
  helperText,
  error = false,
}: SwitchFieldProps) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            disabled={disabled}
            onChange={(e) =>
              onChange(e.target.checked)
            }
          />
        }
        label={label}
      />

      {helperText && (
        <FormHelperText error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormGroup>
  );
}