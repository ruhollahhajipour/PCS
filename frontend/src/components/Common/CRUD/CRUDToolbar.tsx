import {
  Stack,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

type Props = {
  search: string;
  addLabel?: string;
  placeholder?: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
};

export default function CRUDToolbar({
  search,
  addLabel = "New",
  placeholder = "Search...",
  onSearchChange,
  onAdd,
}: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      mb={3}
    >
      <TextField
        size="small"
        value={search}
        placeholder={placeholder}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        sx={{
          width: 350,
          bgcolor: "#FFFFFF",
          borderRadius: 2,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={onAdd}
      >
        {addLabel}
      </Button>
    </Stack>
  );
}