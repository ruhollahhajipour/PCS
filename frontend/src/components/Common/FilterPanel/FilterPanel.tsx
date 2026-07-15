import type { ReactNode } from "react";

import {
  Paper,
  Stack,
  Button,
} from "@mui/material";

import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

interface FilterPanelProps {
  children: ReactNode;

  onApply?: () => void;

  onReset?: () => void;
}

export default function FilterPanel({
  children,
  onApply,
  onReset,
}: FilterPanelProps) {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
      }}
      elevation={1}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
        >
          {children}
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
        >
          <Button
            variant="outlined"
            startIcon={
              <RestartAltRoundedIcon />
            }
            onClick={onReset}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            startIcon={
              <FilterAltRoundedIcon />
            }
            onClick={onApply}
          >
            Apply
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}