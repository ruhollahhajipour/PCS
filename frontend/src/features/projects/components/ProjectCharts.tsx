import {
  Box,
} from "@mui/material";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";


import type { Project }
from "../../../models/project";




type Props = {

  projects: Project[];

};






export default function ProjectCharts({

  projects,

}:Props){





  const data = projects.map(
    project => ({

      name:
        project.shortName ||
        project.code,


      budget:
        Number(project.budget ?? 0),


      actualCost:
        Number(project.actualCost ?? 0),


      progress:
        Number(project.progress ?? 0),


    })
  );








  return (


    <Box

      sx={{

        height:400,

        width:"100%",

      }}

    >


      <ResponsiveContainer>


        <BarChart

          data={data}

        >



          <CartesianGrid

            strokeDasharray="3 3"

          />



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

            dataKey="actualCost"

            name="Actual Cost"

          />



          <Bar

            dataKey="progress"

            name="Progress %"

          />



        </BarChart>


      </ResponsiveContainer>


    </Box>


  );


}