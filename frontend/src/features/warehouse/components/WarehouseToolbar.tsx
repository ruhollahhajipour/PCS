import {
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  onNew: () => void;
  onRefresh: () => void;
};

export default function WarehouseToolbar({
  search,
  onSearch,
  onNew,
  onRefresh,
}: Props) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Search Item"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        size="small"
        sx={{
          minWidth: 320,
        }}
      />

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNew}
        >
          New Item
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>

        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
        >
          Import Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
        >
          Export Excel
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<PictureAsPdfIcon />}
        >
          PDF
        </Button>
      </Stack>
    </Box>
  );
}