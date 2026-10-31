import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


type Props = {
  data: {
    name: string;
    progress: number;
  }[];
};


export default function ProgressChart({
  data,
}: Props) {


  return (

    <Card
      sx={{
        borderRadius:4,
        height:"100%",
      }}
    >

      <CardContent>


        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Project Progress
        </Typography>


        <Box height={300}>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={data}
            >

              <XAxis
                dataKey="name"
              />

              <YAxis
                domain={[0,100]}
              />

              <Tooltip />


              <Bar
                dataKey="progress"
                name="Progress %"
              />


            </BarChart>

          </ResponsiveContainer>

        </Box>


      </CardContent>

    </Card>

  );

}