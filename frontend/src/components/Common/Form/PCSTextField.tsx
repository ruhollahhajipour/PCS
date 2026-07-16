import TextField from "@mui/material/TextField";

type PCSTextFieldProps = {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function PCSTextField({
  label,
  name,
  value,
  required = false,
  disabled = false,
  multiline = false,
  rows = 3,
  type = "text",
  onChange,
}: PCSTextFieldProps) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      name={name}
      value={value}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      type={type}
      onChange={onChange}
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: "#FFFFFF",
        },
      }}
    />
  );
}