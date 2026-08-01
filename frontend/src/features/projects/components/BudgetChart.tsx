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
  Legend,
} from "recharts";


type Props = {
  data: {
    name: string;
    budget: number;
    actual: number;
  }[];
};


export default function BudgetChart({
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

          Budget vs Actual Cost

        </Typography>



        <Box
          height={300}
        >

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

              <YAxis />

              <Tooltip />

              <Legend />


              <Bar
                dataKey="budget"
                name="Budget"
              />


              <Bar
                dataKey="actual"
                name="Actual"
              />


            </BarChart>


          </ResponsiveContainer>


        </Box>


      </CardContent>


    </Card>

  );

}