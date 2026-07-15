import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
} from "@mui/material";

interface InfoCardProps {
  title: string;

  value: string | number;

  icon?: ReactNode;

  color?: string;

  subtitle?: string;
}

export default function InfoCard({
  title,
  value,
  icon,
  color = "#1976d2",
  subtitle,
}: InfoCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              mt={1}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {icon && (
            <Box
              sx={{
                color,
                fontSize: 42,
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}