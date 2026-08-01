import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import type { ReactNode } from "react";

type Props = {
  title: string;
  value: ReactNode;
  change?: string;
  icon?: ReactNode;
};

export default function KPICard({
  title,
  value,
  change,
  icon,
}: Props) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            {title}
          </Typography>

          {icon}

        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          mt={2}
        >
          {value}
        </Typography>

        {change && (
          <Typography
            variant="body2"
            color="success.main"
            mt={1}
          >
            {change}
          </Typography>
        )}

      </CardContent>
    </Card>
  );
}