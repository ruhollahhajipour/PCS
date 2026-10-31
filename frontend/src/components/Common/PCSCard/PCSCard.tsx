import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  Divider,
  Typography,
  Box,
} from "@mui/material";

interface PCSCardProps {
  title?: string;

  children: ReactNode;

  actions?: ReactNode;

  elevation?: number;
}

export default function PCSCard({
  title,
  children,
  actions,
  elevation = 1,
}: PCSCardProps) {
  return (
    <Card
      elevation={elevation}
      sx={{
        borderRadius: 2,
      }}
    >
      {title && (
        <>
          <Box
            px={2}
            py={1.5}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>

            {actions}
          </Box>

          <Divider />
        </>
      )}

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}