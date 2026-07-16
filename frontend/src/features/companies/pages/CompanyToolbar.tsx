import { Stack, Button, TextField, InputAdornment } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
};

export default function CompanyToolbar({
  search,
  onSearchChange,
  onAdd,
}: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      spacing={2}
    >
      <TextField
        size="small"
        placeholder="Search company..."
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
        sx={{
          width: 350,
          bgcolor: "#fff",
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
        New Company
      </Button>
    </Stack>
  );
}