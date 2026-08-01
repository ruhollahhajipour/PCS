import {
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";


import {
  useState,
} from "react";


import WbsStep
from "../components/steps/WbsStep";


import CompanyStep
from "../components/steps/CompanyStep";


import ProjectStep
from "../components/steps/ProjectStep";




const steps = [

  "Company",

  "Project",

  "WBS",

  "Excel Import",

  "Progress Control"

];






export default function ProjectSetup(){



  const [activeStep,setActiveStep] =
    useState(0);



  const [companyId,setCompanyId] =
    useState<string | null>(null);



  const [projectId,setProjectId] =
    useState<string | null>(null);







  function handleCompanyComplete(
    id:string
  ){

    setCompanyId(id);

    setActiveStep(1);

  }







  function handleProjectComplete(
    id:string
  ){

    setProjectId(id);

    setActiveStep(2);

  }








  return (

    <Box>


      <Typography

        variant="h4"

        fontWeight={700}

        mb={3}

      >

        PCS Project Setup

      </Typography>





      <Paper

        sx={{

          p:4,

          borderRadius:4

        }}

      >



        <Stepper

          activeStep={activeStep}

          alternativeLabel

        >


          {
            steps.map(

              step => (

                <Step key={step}>

                  <StepLabel>

                    {step}

                  </StepLabel>


                </Step>

              )

            )
          }


        </Stepper>







        <Box

          mt={6}

        >





          {
            activeStep === 0 &&

            (

              <CompanyStep

                onComplete={
                  handleCompanyComplete
                }

              />

            )

          }








          {
            activeStep === 1 &&

            companyId &&

            (

              <ProjectStep

                companyId={
                  companyId
                }


                onComplete={
                  handleProjectComplete
                }

              />

            )

          }








          {
            activeStep === 2 &&

            projectId &&

            (

              <WbsStep

                projectId={
                  projectId
                }


                onComplete={() => {

                  setActiveStep(3);

                }}

              />

            )

          }







        </Box>




      </Paper>


    </Box>

  );

}