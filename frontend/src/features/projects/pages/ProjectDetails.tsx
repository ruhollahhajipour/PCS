import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Button,
  LinearProgress,
} from "@mui/material";

import ArrowBackRoundedIcon
from "@mui/icons-material/ArrowBackRounded";

import EditRoundedIcon
from "@mui/icons-material/EditRounded";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import ProjectService
from "../services/project.service";

import ProjectDialog
from "../dialogs/ProjectDialog";

import evmCalculator
from "../utils/evmCalculator";

import EVMCard
from "../components/EVMCard";

import type { Project }
from "../../../models/project";







export default function ProjectDetails(){



  const navigate =
    useNavigate();



  const { id } =
    useParams();





  const [
    project,
    setProject
  ] =
    useState<Project | null>(null);




  const [
    loading,
    setLoading
  ] =
    useState(true);





  const [
    editOpen,
    setEditOpen
  ] =
    useState(false);









  async function load(){



    try{



      if(!id)
        return;



      const data =
        await ProjectService.getById(id);



      setProject(data);



    }
    catch(error){



      console.error(
        "Project load failed",
        error
      );



    }
    finally{



      setLoading(false);



    }



  }









  useEffect(()=>{


    load();


  },[id]);









  async function handleUpdate(
    data:Project
  ){



    await ProjectService.update(
      data
    );



    await load();



  }









  if(loading){



    return (


      <Box p={3}>


        <Typography>

          Loading project...

        </Typography>


      </Box>


    );



  }









  if(!project){



    return (


      <Box p={3}>


        <Typography variant="h5">

          Project Not Found

        </Typography>



        <Button

          sx={{mt:2}}

          variant="contained"

          onClick={()=>navigate(-1)}

        >

          Back

        </Button>


      </Box>


    );


  }









  const budget =
    Number(project.budget ?? 0);



  const actual =
    Number(project.actualCost ?? 0);



  const progress =
    Number(project.progress ?? 0);





  const variance =
    budget - actual;





  const evm =
    evmCalculator(project);







  const statusColor:
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info" =


    project.status === "Active"

    ? "success"

    :

    project.status === "Completed"

    ? "info"

    :

    project.status === "Delayed"

    ? "error"

    :

    "default";









  const cards = [



    {
      title:"Budget",
      value:`$ ${budget.toLocaleString("en-US")}`,
    },


    {
      title:"Actual Cost",
      value:`$ ${actual.toLocaleString("en-US")}`,
    },


    {
      title:"Cost Variance",
      value:`$ ${variance.toLocaleString("en-US")}`,
    },


    {
      title:"Progress",
      value:`${progress}%`,
    },


    {
      title:"SPI",
      value:project.spi.toFixed(2),
    },


    {
      title:"CPI",
      value:project.cpi.toFixed(2),
    },


  ];









  return (



    <Box p={3}>



      <Button

        startIcon={
          <ArrowBackRoundedIcon />
        }

        onClick={()=>navigate(-1)}

        sx={{mb:3}}

      >

        Back

      </Button>








      <Card

        sx={{

          borderRadius:4

        }}

      >


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

                {project.name}


              </Typography>



              <Typography

                color="text.secondary"

              >

                {project.code}


              </Typography>



            </Box>






            <Box

              display="flex"

              gap={2}

              alignItems="center"

            >



              <Chip

                label={
                  project.status ?? "Active"
                }

                color={statusColor}

              />





              <Button

                variant="outlined"

                startIcon={
                  <EditRoundedIcon />
                }

                onClick={()=>setEditOpen(true)}

              >

                Edit

              </Button>




            </Box>



          </Box>








          <Divider sx={{my:3}} />








          <Box

            display="grid"

            gridTemplateColumns={{

              xs:"1fr",

              sm:"repeat(2,1fr)",

              md:"repeat(3,1fr)"

            }}

            gap={3}

          >



            {cards.map(item=>(


              <Card

                key={item.title}

                variant="outlined"

                sx={{
                  borderRadius:3
                }}

              >


                <CardContent>


                  <Typography

                    color="text.secondary"

                  >

                    {item.title}

                  </Typography>



                  <Typography

                    variant="h6"

                    fontWeight={800}

                    mt={1}

                  >

                    {item.value}

                  </Typography>



                </CardContent>


              </Card>


            ))}


          </Box>









          <Box mt={4}>


            <Typography

              fontWeight={700}

              mb={1}

            >

              Project Progress

            </Typography>



            <LinearProgress

              variant="determinate"

              value={progress}

              sx={{

                height:10,

                borderRadius:5

              }}

            />


          </Box>








          <Divider sx={{my:4}} />






          <Typography

            variant="h6"

            fontWeight={800}

            mb={2}

          >

            Earned Value Management (EVM)

          </Typography>






          <EVMCard

            data={evm}

          />




        </CardContent>


      </Card>








      <ProjectDialog


        open={editOpen}


        project={project}


        onClose={()=>setEditOpen(false)}


        onSave={async(data)=>{

          await handleUpdate(data);

          setEditOpen(false);

        }}


      />




    </Box>


  );


}