import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { costMock } from "../data/cost.mock";
import evmCalculator from "../utils/evmCalculator";

export default function CostDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const item =
    costMock.find(
      x => String(x.id) === String(id)
    );

  if (!item) {

    return (

      <Box p={3}>

        <Typography variant="h5">

          Cost Item Not Found

        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate(-1)}
        >

          Back

        </Button>

      </Box>

    );

  }

  const evm = evmCalculator(item);

  const statusColor =
    item.status === "Critical"
      ? "error"
      : item.status === "Warning"
      ? "warning"
      : "success";

  const cards = [

    {
      title: "Budget",
      value: `$ ${item.budget.toLocaleString("en-US")}`,
    },

    {
      title: "Commitment",
      value: `$ ${item.commitment.toLocaleString("en-US")}`,
    },

    {
      title: "Actual",
      value: `$ ${item.actual.toLocaleString("en-US")}`,
    },

    {
      title: "Forecast",
      value: `$ ${item.forecast.toLocaleString("en-US")}`,
    },

    {
      title: "Variance",
      value: `$ ${item.variance.toLocaleString("en-US")}`,
    },

    {
      title: "Progress",
      value: `${item.progress}%`,
    },

  ];

  return (

    <Box p={3}>

      <Button

        startIcon={<ArrowBackRoundedIcon />}

        sx={{ mb: 3 }}

        onClick={() => navigate(-1)}

      >

        Back

      </Button>

      <Card sx={{ borderRadius: 4 }}>

        <CardContent>

          <Box

            display="flex"

            justifyContent="space-between"

            alignItems="center"

          >

            <Box>

              <Typography

                variant="h4"

                fontWeight={800}

              >

                {item.project}

              </Typography>

              <Typography color="text.secondary">

                {item.wbs}

              </Typography>

            </Box>

            <Chip

              label={item.status}

              color={statusColor}

            />

          </Box>

          <Divider sx={{ my: 3 }} />

          <Box

            display="grid"

            gridTemplateColumns={{

              xs: "1fr",

              sm: "repeat(2,1fr)",

              md: "repeat(3,1fr)",

            }}

            gap={3}

          >

            {cards.map(card => (

              <Card

                key={card.title}

                variant="outlined"

                sx={{ borderRadius: 3 }}

              >

                <CardContent>

                  <Typography

                    variant="body2"

                    color="text.secondary"

                  >

                    {card.title}

                  </Typography>

                  <Typography

                    variant="h6"

                    fontWeight={700}

                    mt={1}

                  >

                    {card.value}

                  </Typography>

                </CardContent>

              </Card>

            ))}

          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography

            variant="h6"

            fontWeight={700}

            mb={2}

          >

            Earned Value Management

          </Typography>

          <Box

            display="grid"

            gridTemplateColumns={{

              xs: "1fr",

              md: "repeat(3,1fr)",

            }}

            gap={3}

          >

            <Card>

              <CardContent>

                <Typography color="text.secondary">

                  BAC

                </Typography>

                <Typography variant="h6">

                  {evm.BAC.toLocaleString("en-US")}

                </Typography>

              </CardContent>

            </Card>

            <Card>

              <CardContent>

                <Typography color="text.secondary">

                  EV

                </Typography>

                <Typography variant="h6">

                  {evm.EV.toLocaleString("en-US")}

                </Typography>

              </CardContent>

            </Card>

            <Card>

              <CardContent>

                <Typography color="text.secondary">

                  PV

                </Typography>

                <Typography variant="h6">

                  {evm.PV.toLocaleString("en-US")}

                </Typography>

              </CardContent>

            </Card>

            <Card>

              <CardContent>

                <Typography color="text.secondary">

                  AC

                </Typography>

                <Typography variant="h6">

                  {evm.AC.toLocaleString("en-US")}

                </Typography>

              </CardContent>

            </Card>

            <Card>

              <CardContent>

                <Typography color="text.secondary">

                  SPI

                </Typography>

                <Typography variant="h6">

                  {evm.SPI.toFixed(2)}

                </Typography>

              </CardContent>

            </Card>

            <Card>

              <CardContent>

                <Typography color="text.secondary">

                  CPI

                </Typography>

                <Typography variant="h6">

                  {evm.CPI.toFixed(2)}

                </Typography>

              </CardContent>

            </Card>

          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography

            fontWeight={700}

            mb={1}

          >

            Progress

          </Typography>

          <LinearProgress

            variant="determinate"

            value={item.progress}

            sx={{

              height: 10,

              borderRadius: 5,

            }}

          />

          <Typography mt={1}>

            {item.progress}%

          </Typography>

        </CardContent>

      </Card>

    </Box>

  );

}