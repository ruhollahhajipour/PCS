import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

type KPICardProps = {
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
}: KPICardProps) {
  const positive = change.startsWith("+");

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        border: "1px solid #E8ECF2",
        backgroundColor: "#fff",
        boxShadow: "0 8px 24px rgba(15,23,42,.05)",
        transition: "all .25s ease",
        height: "100%",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(15,23,42,.12)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: 3,
            bgcolor: color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            letterSpacing: 0.4,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mt: 2,
            fontWeight: 800,
            color: "#16355B",
          }}
        >
          {value}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            color: positive ? "#16A34A" : "#DC2626",
          }}
        >
          {positive ? (
            <TrendingUpRoundedIcon fontSize="small" />
          ) : (
            <TrendingDownRoundedIcon fontSize="small" />
          )}

          <Typography
            sx={{
              ml: 1,
              fontWeight: 700,
            }}
          >
            {change}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}