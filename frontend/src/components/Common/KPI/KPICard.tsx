import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

type Props = {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
};

export default function KPICard({
  title,
  value,
  change,
  positive = true,
  icon,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        height: "100%",
        transition: ".25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 12px 28px rgba(0,0,0,.08)",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              fontSize={13}
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              mt={1}
              fontWeight={700}
              fontSize={28}
            >
              {value}
            </Typography>

            {change && (
              <Box
                mt={1}
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                {positive ? (
                  <TrendingUpIcon
                    color="success"
                    fontSize="small"
                  />
                ) : (
                  <TrendingDownIcon
                    color="error"
                    fontSize="small"
                  />
                )}

                <Typography
                  fontSize={13}
                  color={
                    positive
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>

          {icon && (
            <Box
              sx={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                bgcolor: "#EEF4FF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}