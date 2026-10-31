import {
  Box,
  Pagination,
  Typography,
} from "@mui/material";

interface PCSPaginationProps {
  page: number;

  count: number;

  total?: number;

  onChange: (
    page: number
  ) => void;
}

export default function PCSPagination({
  page,
  count,
  total,
  onChange,
}: PCSPaginationProps) {
  return (
    <Box
      mt={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {total !== undefined
          ? `Total Records : ${total}`
          : ""}
      </Typography>

      <Pagination
        page={page}
        count={count}
        color="primary"
        onChange={(_, value) =>
          onChange(value)
        }
      />
    </Box>
  );
}