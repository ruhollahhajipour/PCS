import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography
} from "@mui/material";

import { Link } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import PageHeader from "../../../components/Common/PageHeader";

export default function WarehousePage() {

  return (

    <Box>

      <PageHeader
        title="Warehouse Management"
        subtitle="Warehouse modules and inventory operations"
      />

      <Grid
        container
        spacing={3}
        sx={{ mt: 2 }}
      >

        <Grid size={{ xs: 12, md: 4 }}>

          <Card sx={{ borderRadius: 3 }}>

            <CardActionArea
              component={Link}
              to="/warehouse/dashboard"
            >

              <CardContent>

                <DashboardIcon
                  color="primary"
                  sx={{ fontSize: 42 }}
                />

                <Typography
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Warehouse Dashboard
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Inventory KPIs and warehouse overview.
                </Typography>

              </CardContent>

            </CardActionArea>

          </Card>

        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>

          <Card sx={{ borderRadius: 3 }}>

            <CardActionArea
              component={Link}
              to="/warehouse/stock"
            >

              <CardContent>

                <Inventory2Icon
                  color="primary"
                  sx={{ fontSize: 42 }}
                />

                <Typography
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Stock
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  View current inventory, quantities and stock status.
                </Typography>

              </CardContent>

            </CardActionArea>

          </Card>

        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>

          <Card sx={{ borderRadius: 3 }}>

            <CardActionArea
              component={Link}
              to="/warehouse/reorder"
            >

              <CardContent>

                <ShoppingCartIcon
                  color="primary"
                  sx={{ fontSize: 42 }}
                />

                <Typography
                  variant="h6"
                  sx={{ mt: 2 }}
                >
                  Reorder
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Materials below reorder point and purchase suggestions.
                </Typography>

              </CardContent>

            </CardActionArea>

          </Card>

        </Grid>

      </Grid>

    </Box>

  );

}