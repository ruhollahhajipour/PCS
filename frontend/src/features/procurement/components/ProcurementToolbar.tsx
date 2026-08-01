import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import {
  Box,
  Button,
  TextField,
} from "@mui/material";

type Props = {
  search: string;

  onSearch: (value: string) => void;

  onNew: () => void;

  onRefresh: () => void;
};

export default function ProcurementToolbar({
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
      gap={2}
      mb={3}
      flexWrap="wrap"
    >
      <TextField
        size="small"
        placeholder="Search Procurement..."
        value={search}
        onChange={(e) =>
          onSearch(e.target.value)
        }
        sx={{
          width: 350,
        }}
      />

      <Box
        display="flex"
        gap={1}
      >
        <Button
          variant="outlined"
          startIcon={
            <RefreshRoundedIcon />
          }
          onClick={onRefresh}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          startIcon={
            <AddRoundedIcon />
          }
          onClick={onNew}
        >
          New PR
        </Button>
      </Box>
    </Box>
  );
}