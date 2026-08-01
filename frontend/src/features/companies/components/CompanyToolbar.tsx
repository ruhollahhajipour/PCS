import {
  Box,
  Button,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

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
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 5,
        border: "1px solid #E2E8F0",
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
      >
        <TextField
          size="small"
          value={search}
          placeholder="Search company..."
          onChange={(e) => onSearch(e.target.value)}
          sx={{
            width: 360,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              height: 48,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box
          display="flex"
          gap={1.5}
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={onRefresh}
            sx={{ borderRadius: 3 }}
          >
            Refresh
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            sx={{ borderRadius: 3 }}
          >
            Export
          </Button>

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={onNew}
            sx={{
              borderRadius: 3,
              px: 3,
            }}
          >
            New Company
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}