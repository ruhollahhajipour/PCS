import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function CompanyForm() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        mb={3}
        fontWeight={700}
      >
        Company Information
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Company Code"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            label="Company Name"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Short Name"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Country"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="City"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Phone"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Email"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Website"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Currency"
            defaultValue="USD"
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="IRR">IRR</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            type="date"
            label="Fiscal Year Start"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            select
            fullWidth
            label="Status"
            defaultValue="Active"
          >
            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
          />
        </Grid>

      </Grid>

      <Box mt={4}>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
        >

          <Button
            variant="outlined"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
          >
            Save
          </Button>

        </Stack>

      </Box>

    </Paper>
  );
}