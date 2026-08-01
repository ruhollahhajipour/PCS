import React from "react";

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";

type Props = {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
};

export default function KPICard({
  title,
  value,
  change = "0%",
  subtitle = "vs previous period",
  icon,
  color = "#2563EB",
}: Props) {
  const numeric = Number(
    change.replace("%", "").replace("+", "")
  );

  const positive = numeric > 0;
  const negative = numeric < 0;
  const neutral = numeric === 0;

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",

        minHeight: 180,

        height: "100%",

        borderRadius: 4,

        overflow: "hidden",

        border:
          "1px solid rgba(148,163,184,.18)",

        background:
          "linear-gradient(180deg,#FFFFFF 0%,#F8FAFC 100%)",

        transition:
          "transform .25s ease, box-shadow .25s ease",

        "&:hover": {
          transform: "translateY(-3px)",

          boxShadow:
            "0 12px 24px rgba(15,23,42,.08)",
        },

        "&::before": {
          content: '""',

          position: "absolute",

          top: 0,

          left: 0,

          right: 0,

          height: 4,

          background: color,
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",

          display: "flex",

          flexDirection: "column",

          justifyContent: "space-between",

          p: 3,

          "&:last-child": {
            pb: 3,
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          <Box flex={1} minWidth={0}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                mb: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.1,
                color: "text.primary",
                wordBreak: "break-word",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 56,

              height: 56,

              flexShrink: 0,

              borderRadius: 3,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              bgcolor: `${color}15`,

              color,
            }}
          >
            {icon}
          </Box>
        </Box>
                <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            flexWrap="wrap"
          >
            {positive && (
              <TrendingUpRoundedIcon
                color="success"
                fontSize="small"
              />
            )}

            {negative && (
              <TrendingDownRoundedIcon
                color="error"
                fontSize="small"
              />
            )}

            {neutral && (
              <TrendingFlatRoundedIcon
                color="disabled"
                fontSize="small"
              />
            )}

            <Chip
              label={change}
              size="small"
              color={
                positive
                  ? "success"
                  : negative
                  ? "error"
                  : "default"
              }
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                minWidth: 62,
              }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}