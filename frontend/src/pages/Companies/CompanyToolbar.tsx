import {
  Stack,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface Props {
  onAdd?: () => void;
}

export default function CompanyToolbar({
  onAdd,
}: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <TextField
        size="small"
        placeholder="Search Company..."
        sx={{ width: 360 }}
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
        sx={{
          borderRadius: 3,
          px: 3,
          textTransform: "none",
          background:
            "linear-gradient(90deg,#2563EB,#4F46E5)",

          "&:hover": {
            background:
              "linear-gradient(90deg,#1D4ED8,#4338CA)",
          },
        }}
      >
        New Company
      </Button>
    </Stack>
  );
}