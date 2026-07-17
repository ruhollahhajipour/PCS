import {
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  onNew: () => void;
  onRefresh: () => void;
};

export default function CompanyToolbar({
  search,
  onSearch,
  onNew,
  onRefresh,
}: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      gap={2}
      flexWrap="wrap"
    >
      <TextField
        size="small"
        sx={{ width: 340 }}
        value={search}
        placeholder="Search company..."
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
        >
          Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
        >
          PDF
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNew}
        >
          New Company
        </Button>
      </Box>
    </Box>
  );
}