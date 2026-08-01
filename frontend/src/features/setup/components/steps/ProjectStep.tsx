import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import {
  useState,
} from "react";


import ProjectSetupService
from "../../services/project.setup.service";



interface ProjectStepProps {

  companyId: string;

  onComplete?: (
    projectId: string
  ) => void;

}




export default function ProjectStep(
  {
    companyId,
    onComplete
  }: ProjectStepProps
) {



  const [saving,setSaving] =
    useState(false);



  const [project,setProject] =
    useState({

      code:"",

      name:"",

      description:"",

      startDate:"",

      endDate:"",

      budget:0

    });







  function updateField(
    field:string,
    value:string
  ){


    setProject({

      ...project,

      [field]:value

    });


  }







  async function handleSubmit(){


    try {


      setSaving(true);



      const result =
        await ProjectSetupService.create({

          code:
            project.code,


          name:
            project.name,


          description:
            project.description,


          companyId,


          startDate:
            project.startDate,


          endDate:
            project.endDate,


          budget:
            Number(project.budget)

        });




      console.log(
        "Project Created:",
        result
      );




      if(onComplete){

        onComplete(result);

      }



    }
    catch(error){


      console.error(
        error
      );


      alert(
        "Error while saving project"
      );


    }
    finally{


      setSaving(false);


    }


  }








  return (

    <Box>


      <Typography

        variant="h6"

        fontWeight={700}

        mb={3}

      >

        Project Information

      </Typography>





      <Box


        display="grid"


        gridTemplateColumns={{

          xs:"1fr",

          md:"1fr 1fr"

        }}


        gap={2}


      >





        <TextField

          label="Project Code"

          value={project.code}

          onChange={
            e =>
              updateField(
                "code",
                e.target.value
              )
          }

        />






        <TextField

          label="Project Name"

          value={project.name}

          onChange={
            e =>
              updateField(
                "name",
                e.target.value
              )
          }

        />







        <TextField

          label="Start Date"

          type="date"

          InputLabelProps={{
            shrink:true
          }}

          value={project.startDate}

          onChange={
            e =>
              updateField(
                "startDate",
                e.target.value
              )
          }

        />







        <TextField

          label="End Date"

          type="date"

          InputLabelProps={{
            shrink:true
          }}

          value={project.endDate}

          onChange={
            e =>
              updateField(
                "endDate",
                e.target.value
              )
          }

        />







        <TextField

          label="Budget"

          type="number"

          value={project.budget}

          onChange={
            e =>
              updateField(
                "budget",
                e.target.value
              )
          }

        />






        <TextField

          label="Description"

          value={project.description}

          onChange={
            e =>
              updateField(
                "description",
                e.target.value
              )
          }

        />



      </Box>







      <Box

        mt={4}

        display="flex"

        justifyContent="flex-end"

      >



        <Button

          variant="contained"

          size="large"

          disabled={saving}

          onClick={handleSubmit}

        >


          {
            saving
            ?
            "Saving..."
            :
            "Save & Continue"
          }



        </Button>



      </Box>




    </Box>

  );

}