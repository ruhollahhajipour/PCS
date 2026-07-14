import { Paper, Box, Typography } from "@mui/material";

type Props = {
  title: string;
  value: string;
  change: string;
  color: string;
  icon: React.ReactNode;
};

export default function KPICard({
  title,
  value,
  change,
  color,
  icon,
}: Props) {
  return (
    <Paper
      sx={{
        position: "relative",
        overflow: "hidden",

        borderRadius: 5,

        p: 3,

        height: 180,

        background: "rgba(255,255,255,.82)",

        backdropFilter: "blur(18px)",

        border: "1px solid rgba(255,255,255,.55)",

        boxShadow:
          "0 20px 50px rgba(15,23,42,.08)",

        transition: ".35s",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow:
            "0 35px 70px rgba(37,99,235,.18)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: 6,
          height: "100%",
          bgcolor: color,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#64748B",
              fontSize: 14,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontWeight: 800,
              fontSize: 34,
              color: "#16355B",
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: change.startsWith("-")
                ? "#EF4444"
                : "#10B981",
              fontWeight: 700,
            }}
          >
            {change}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 68,
            height: 68,

            borderRadius: 4,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "white",

            background: color,

            boxShadow: `0 15px 30px ${color}55`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}