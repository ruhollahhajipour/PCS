import {
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

type Props = {
  search: string;

  onSearch: (value: string) => void;

  onRefresh: () => void;

  onNew: () => void;
};

export default function ProjectToolbar({
  search,
  onSearch,
  onRefresh,
  onNew,
}: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <TextField
        size="small"
        placeholder="Search Project..."
        value={search}
        onChange={(e) =>
          onSearch(e.target.value)
        }
        sx={{ width: 340 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onNew}
        >
          New Project
        </Button>
      </Box>
    </Box>
  );
}