import {
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function CompanyDetails() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Company Details
        </Typography>

        <Chip
          color="success"
          label="Active"
        />
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Company Code
          </Typography>

          <Typography variant="body1">
            KGN
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Company Name
          </Typography>

          <Typography variant="body1">
            Kousha Gaman Niroo
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Short Name
          </Typography>

          <Typography variant="body1">
            KGN
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Country
          </Typography>

          <Typography variant="body1">
            Iran
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            City
          </Typography>

          <Typography variant="body1">
            Tehran
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Address
          </Typography>

          <Typography variant="body1">
            Tehran, Iran
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Phone
          </Typography>

          <Typography variant="body1">
            +98 21 00000000
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Email
          </Typography>

          <Typography variant="body1">
            info@kgn.ir
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Website
          </Typography>

          <Typography variant="body1">
            www.kgn.ir
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Currency
          </Typography>

          <Typography variant="body1">
            USD
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Fiscal Year
          </Typography>

          <Typography variant="body1">
            2026
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Description
          </Typography>

          <Typography variant="body1">
            Default company used during PCS
            initialization.
          </Typography>
        </Grid>

      </Grid>
    </Paper>
  );
}