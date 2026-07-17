import {
  Paper,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from "@mui/material";

import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";

const items = [
  {
    id: "1",
    title: "Project",
  },
  {
    id: "1.1",
    title: "Engineering",
  },
  {
    id: "1.2",
    title: "Procurement",
  },
  {
    id: "1.3",
    title: "Construction",
  },
  {
    id: "1.3.1",
    title: "Civil",
  },
  {
    id: "1.3.2",
    title: "Mechanical",
  },
  {
    id: "1.3.3",
    title: "Electrical",
  },
  {
    id: "1.3.4",
    title: "Instrumentation",
  },
];

export default function WBSTree() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 5,
        height: 620,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={3}
      >
        <AccountTreeRoundedIcon
          color="primary"
        />

        <Typography
          variant="h6"
          fontWeight={700}
        >
          Work Breakdown Structure
        </Typography>
      </Box>

      <List dense>
        {items.map((item) => (
          <ListItemButton
            key={item.id}
            sx={{
              borderRadius: 2,
              mb: .5,
            }}
          >
            <ListItemText
              primary={
                <Box
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography
                    fontWeight={600}
                  >
                    {item.title}
                  </Typography>

                  <Chip
                    size="small"
                    label={item.id}
                  />
                </Box>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}