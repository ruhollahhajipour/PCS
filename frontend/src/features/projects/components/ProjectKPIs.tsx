import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import {
  FolderRounded,
  PlayCircleRounded,
  AccountBalanceWalletRounded,
  PaymentsRounded,
  TimelineRounded,
  WarningRounded,
} from "@mui/icons-material";

import type { Project } from "../types/project";


type Props = {
  projects: Project[];
};



export default function ProjectKPIs({
  projects,
}: Props) {


  const totalProjects =
    projects.length;



  const activeProjects =
    projects.filter(
      (x) =>
        x.status === "Active"
    ).length;



  const totalBudget =
    projects.reduce(
      (sum, item) =>
        sum + Number(item.budget || 0),
      0
    );



  const actualCost =
    projects.reduce(
      (sum, item) =>
        sum + Number(item.actualCost || 0),
      0
    );



  const avgProgress =
    projects.length
      ? Math.round(
          projects.reduce(
            (sum, item) =>
              sum + Number(item.progress || 0),
            0
          ) / projects.length
        )
      : 0;



  const delayedProjects =
    projects.filter(
      (x) =>
        x.status === "Inactive"
    ).length;





  const cards = [

    {
      title: "Total Projects",
      value: totalProjects,
      icon: <FolderRounded />,
    },


    {
      title: "Active Projects",
      value: activeProjects,
      icon: <PlayCircleRounded />,
    },


    {
      title: "Total Budget",
      value:
        `$ ${totalBudget.toLocaleString()}`,
      icon:
        <AccountBalanceWalletRounded />,
    },


    {
      title: "Actual Cost",
      value:
        `$ ${actualCost.toLocaleString()}`,
      icon:
        <PaymentsRounded />,
    },


    {
      title: "Average Progress",
      value:
        `${avgProgress}%`,
      icon:
        <TimelineRounded />,
    },


    {
      title: "Inactive Projects",
      value:
        delayedProjects,
      icon:
        <WarningRounded />,
    },

  ];






  return (

    <Grid
      container
      spacing={2}
      mb={3}
    >


      {cards.map((card) => (


        <Grid

          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 2,
          }}

          key={card.title}

        >


          <Card

            sx={{

              borderRadius: 4,

              height: "100%",


              boxShadow:
                "0 8px 25px rgba(15,23,42,.08)",


              transition:
                ".25s",


              "&:hover": {

                transform:
                  "translateY(-4px)",

              },

            }}

          >


            <CardContent>


              <Box

                sx={{

                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  mb: 2,

                }}

              >


                <Typography

                  color="text.secondary"

                  fontSize={13}

                  fontWeight={600}

                >

                  {card.title}

                </Typography>



                <Box

                  color="primary.main"

                >

                  {card.icon}

                </Box>



              </Box>





              <Typography

                variant="h5"

                fontWeight={800}

              >

                {card.value}

              </Typography>



            </CardContent>



          </Card>



        </Grid>


      ))}


    </Grid>

  );

}