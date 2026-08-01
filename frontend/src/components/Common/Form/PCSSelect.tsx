import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

type PCSSelectOption = {
  value: string;
  label: string;
};

type PCSSelectProps = {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  options: PCSSelectOption[];
  onChange: (event: SelectChangeEvent) => void;
};

export default function PCSSelect({
  label,
  name,
  value,
  required = false,
  disabled = false,
  options,
  onChange,
}: PCSSelectProps) {
  return (
    <FormControl
      fullWidth
      size="small"
      required={required}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        sx={{
          borderRadius: 2,
          bgcolor: "#FFFFFF",
        }}
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
    </FormControl>
  );
}