import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface SearchBoxProps {
  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  width?: number | string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  width = 300,
}: SearchBoxProps) {
  return (
    <TextField
      size="small"
      value={value}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(e.target.value)
      }
      sx={{
        width,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}