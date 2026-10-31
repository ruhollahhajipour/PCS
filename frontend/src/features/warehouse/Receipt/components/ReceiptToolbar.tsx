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

export default function ReceiptToolbar({
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
      mb={2}
      gap={2}
    >
      <TextField
        size="small"
        label="Search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        sx={{ width: 350 }}
      />

      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          onClick={onRefresh}
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          onClick={onNew}
        >
          New Receipt
        </Button>
      </Box>
    </Box>
  );
}