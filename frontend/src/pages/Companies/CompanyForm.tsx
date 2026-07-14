import { Grid, MenuItem, TextField } from "@mui/material";

type Props = {
  data?: any;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function CompanyForm({
  data,
  onChange,
}: Props) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="code"
          label="Company Code"
          value={data?.code || ""}
          onChange={onChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="name"
          label="Company Name"
          value={data?.name || ""}
          onChange={onChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="country"
          label="Country"
          value={data?.country || ""}
          onChange={onChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="currency"
          label="Currency"
          value={data?.currency || ""}
          onChange={onChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="timezone"
          label="Time Zone"
          value={data?.timezone || ""}
          onChange={onChange}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          select
          fullWidth
          name="status"
          label="Status"
          value={data?.status || "Active"}
          onChange={onChange}
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
          rows={3}
          name="address"
          label="Address"
          value={data?.address || ""}
          onChange={onChange}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
          label="Description"
          value={data?.description || ""}
          onChange={onChange}
        />
      </Grid>
    </Grid>
  );
}