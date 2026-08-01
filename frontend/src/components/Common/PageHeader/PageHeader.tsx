import type { ReactNode } from "react";

import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Typography,
} from "@mui/material";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;

  subtitle?: string;

  breadcrumbs?: BreadcrumbItem[];

  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
}: PageHeaderProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
      mb={3}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            sx={{ mb: 1 }}
            aria-label="breadcrumb"
          >
            {breadcrumbs.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  underline="hover"
                  color="inherit"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <Typography
                  key={item.label}
                  color="text.primary"
                >
                  {item.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}

        <Typography
          variant="h4"
          fontWeight={700}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            mt={1}
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions}
    </Stack>
  );
}