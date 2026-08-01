import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";



type Props = {

  data:{
    name:string;
    spi:number;
    cpi:number;
  }[];

};



export default function PerformanceChart({
  data,
}:Props){


return (

<Card
sx={{
borderRadius:4,
}}
>

<CardContent>


<Typography
variant="h6"
fontWeight={700}
mb={2}
>
SPI / CPI Performance
</Typography>



<Box height={300}>

<ResponsiveContainer
width="100%"
height="100%"
>


<LineChart
data={data}
>


<XAxis
dataKey="name"
/>


<YAxis
domain={[0,1.5]}
/>


<Tooltip />

<Legend />


<Line
type="monotone"
dataKey="spi"
name="SPI"
/>


<Line
type="monotone"
dataKey="cpi"
name="CPI"
/>



</LineChart>


</ResponsiveContainer>


</Box>


</CardContent>


</Card>


);

}