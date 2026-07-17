import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

type Props = {
  title: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
};

export default function KPICard({
  title,
  value,
  change = "+0%",
  icon,
}: Props) {

  const positive = !change.startsWith("-");

  return (

    <Card

      elevation={0}

      sx={{

        borderRadius:5,

        height:170,

        background:
          "linear-gradient(135deg,#FFFFFF,#F8FAFC)",

        border:"1px solid #E2E8F0",

        transition:".35s",

        overflow:"hidden",

        "&:hover":{

          transform:"translateY(-8px)",

          boxShadow:
            "0 25px 45px rgba(15,23,42,.12)",

        },

      }}

    >

      <CardContent
        sx={{
          height:"100%",
        }}
      >

        <Box

          display="flex"

          justifyContent="space-between"

        >

          <Box>

            <Typography

              color="text.secondary"

              fontSize={15}

            >

              {title}

            </Typography>

            <Typography

              mt={2}

              fontSize={34}

              fontWeight={800}

            >

              {value}

            </Typography>

          </Box>

          <Box

            sx={{

              width:58,

              height:58,

              borderRadius:4,

              display:"flex",

              justifyContent:"center",

              alignItems:"center",

              bgcolor:"#EFF6FF",

            }}

          >

            {icon}

          </Box>

        </Box>

        <Box

          mt={4}

          display="flex"

          alignItems="center"

          gap={1}

        >

          {

            positive ?

            <TrendingUpRoundedIcon color="success"/>

            :

            <TrendingDownRoundedIcon color="error"/>

          }

          <Typography

            fontWeight={700}

            color={
              positive
              ? "success.main"
              : "error.main"
            }

          >

            {change}

          </Typography>

          <Typography

            color="text.secondary"

            fontSize={13}

          >

            compared to last month

          </Typography>

        </Box>

      </CardContent>

    </Card>

  );

}