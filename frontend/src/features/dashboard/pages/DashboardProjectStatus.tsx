import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";

export default function DashboardProjectStatus() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 4,
        border: "1px solid rgba(148,163,184,.18)",
        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        Project Status
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={1}
      >
        EPC Progress
      </Typography>

      <LinearProgress
        variant="determinate"
        value={74}
        sx={{
          height: 10,
          borderRadius: 10,
          mb: 1,
        }}
      />

      <Typography
        variant="body2"
        fontWeight={700}
        color="primary"
        mb={3}
      >
        74% Completed
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography
        fontWeight={700}
        mb={2}
      >
        Recent Activities
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={1.5}
      >
        <Typography variant="body2">
          ✔ Budget Updated
        </Typography>

        <Typography variant="body2">
          ✔ Procurement Approved
        </Typography>

        <Typography variant="body2">
          ✔ Warehouse Synced
        </Typography>

        <Typography variant="body2">
          ✔ Cost Report Generated
        </Typography>
      </Box>
    </Paper>
  );
}