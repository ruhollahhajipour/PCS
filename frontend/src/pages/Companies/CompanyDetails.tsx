import {
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";

import type { Company } from "../../models/company";

interface Props {
  company: Company;
}

export default function CompanyDetails({
  company,
}: Props) {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 5,
        background: "rgba(255,255,255,.82)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        {company.name}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Company Code
          </Typography>

          <Typography fontWeight={600}>
            {company.code}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Short Name
          </Typography>

          <Typography fontWeight={600}>
            {company.shortName}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Country
          </Typography>

          <Typography fontWeight={600}>
            {company.country}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            City
          </Typography>

          <Typography fontWeight={600}>
            {company.city}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography color="text.secondary">
            Address
          </Typography>

          <Typography fontWeight={600}>
            {company.address}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Currency
          </Typography>

          <Typography fontWeight={600}>
            {company.currency}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Status
          </Typography>

          <Chip
            label={company.status}
            color={
              company.status === "Active"
                ? "success"
                : "default"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Registration No.
          </Typography>

          <Typography fontWeight={600}>
            {company.registrationNumber}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Tax Number
          </Typography>

          <Typography fontWeight={600}>
            {company.taxNumber}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Created
          </Typography>

          <Typography fontWeight={600}>
            {company.createdAt}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="text.secondary">
            Updated
          </Typography>

          <Typography fontWeight={600}>
            {company.updatedAt}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}