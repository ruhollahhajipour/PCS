import {
  Box,
  Grid,
} from "@mui/material";


import ProjectKPICards
from "../components/ProjectKPICards";


import ProjectCharts
from "../components/ProjectCharts";


import useProjects
from "../hooks/useProjects";



export default function ProjectDashboard() {



  const {
    projects,
    loading,
  } = useProjects();





  if(loading){

    return (

      <Box p={3}>

        Loading...

      </Box>

    );

  }






  const totalBudget =
    projects.reduce(
      (
        sum,
        item
      ) =>
        sum + Number(item.budget ?? 0),
      0
    );





  const actualCost =
    projects.reduce(
      (
        sum,
        item
      ) =>
        sum + Number(item.actualCost ?? 0),
      0
    );





  const avgProgress =
    projects.length === 0

      ? 0

      :

      projects.reduce(
        (
          sum,
          item
        ) =>
          sum + Number(item.progress ?? 0),
        0
      )
      /
      projects.length;





  const activeProjects =
    projects.filter(
      item =>
        item.isActive
    ).length;







  return (


    <Box p={3}>


      <Grid
        container
        spacing={3}
      >


        <Grid
          size={12}
        >


          <ProjectKPICards

            totalBudget={totalBudget}

            actualCost={actualCost}

            progress={avgProgress}

            activeProjects={activeProjects}

          />


        </Grid>





        <Grid
          size={12}
        >


          <ProjectCharts

            projects={projects}

          />


        </Grid>



      </Grid>



    </Box>


  );

}