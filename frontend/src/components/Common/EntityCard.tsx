import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";

import CompanyAvatar from "../Company/CompanyAvatar";
import CompanyStatus from "../Company/CompanyStatus";
import StatItem from "./StatItem";

interface EntityCardProps {
  title: string;
  subtitle: string;

  code: string;

  status: "Active" | "Inactive";

  plants: number;
  projects: number;
  users: number;
}

export default function EntityCard({
  title,
  subtitle,
  code,
  status,
  plants,
  projects,
  users,
}: EntityCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            "0 20px 40px rgba(37,99,235,.20)",
        },
      }}
    >
      <CardContent>

        <CompanyAvatar name={title} />

        <Typography
          mt={2}
          variant="h6"
          fontWeight={700}
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
        >
          {subtitle}
        </Typography>

        <Typography
          variant="caption"
          color="primary"
        >
          {code}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <StatItem
            label="Plants"
            value={plants}
          />

          <StatItem
            label="Projects"
            value={projects}
          />

          <StatItem
            label="Users"
            value={users}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CompanyStatus status={status} />

          <Button>
            Open
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
}