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
        height: "100%",
        minHeight: 142,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        background:
          "linear-gradient(180deg,#FFFFFF 0%,#FAFCFF 100%)",

        transition:
          "transform .2s ease, box-shadow .2s ease, border-color .2s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "#CBD5E1",
          boxShadow:
            "0 10px 24px rgba(15,23,42,.07)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          background: color,
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          p: 2.25,
          pl: 2.5,
          "&:last-child": {
            pb: 2.25,
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1.5}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 11.5,
                lineHeight: 1.25,
                color: "#64748B",
                fontWeight: 650,
                mb: 0.8,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: 25,
                  sm: 27,
                },
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: "#0F172A",
                wordBreak: "break-word",
              }}
            >
              {value}
            </Typography>
          </Box>

          {icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: 2.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${color}12`,
                color,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
          flexWrap="wrap"
        >
          <Box
            display="flex"
            alignItems="center"
            gap={0.55}
          >
            {positive && (
              <TrendingUpRoundedIcon
                sx={{
                  fontSize: 16,
                  color: "#16A34A",
                }}
              />
            )}

            {negative && (
              <TrendingDownRoundedIcon
                sx={{
                  fontSize: 16,
                  color: "#DC2626",
                }}
              />
            )}

            {neutral && (
              <TrendingFlatRoundedIcon
                sx={{
                  fontSize: 16,
                  color: "#94A3B8",
                }}
              />
            )}

            <Chip
              label={change}
              size="small"
              sx={{
                height: 22,
                minWidth: 52,
                borderRadius: 1.5,
                fontSize: 10,
                fontWeight: 750,

                bgcolor: positive
                  ? "#ECFDF5"
                  : negative
                  ? "#FEF2F2"
                  : "#F1F5F9",

                color: positive
                  ? "#15803D"
                  : negative
                  ? "#B91C1C"
                  : "#64748B",

                "& .MuiChip-label": {
                  px: 0.8,
                },
              }}
            />
          </Box>

          <Typography
            sx={{
              fontSize: 9.5,
              color: "#94A3B8",
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
