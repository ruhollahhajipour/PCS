import {
  useState,
} from "react";


import {
  Box,
  Button,
  CircularProgress,
} from "@mui/material";


import AddRoundedIcon
from "@mui/icons-material/AddRounded";


import {
  useNavigate,
} from "react-router-dom";


import PageHeader
from "../../../components/Common/PageHeader";


import PCSCard
from "../../../components/Common/PCSCard";


import ProjectTable from "../components/ProjectTable";


import ProjectDialog
from "../dialogs/ProjectDialog";


import useProjects
from "../hooks/useProjects";


import type { Project }
from "../../../models/project";





export default function Projects() {



  const navigate =
    useNavigate();




  const {

    projects,

    loading,

    create,

    update,

    remove,

  } = useProjects();






  const [
    open,
    setOpen
  ] =
    useState(false);





  const [
    selectedProject,
    setSelectedProject
  ] =
    useState<Project | null>(null);









  function handleCreate() {


    setSelectedProject(null);


    setOpen(true);


  }









  function handleEdit(
    project: Project
  ) {


    setSelectedProject(project);


    setOpen(true);


  }









  function handleView(
    project: Project
  ) {


    navigate(
      `/projects/${project.id}`
    );


  }









  async function handleSave(
    project: Project
  ) {



    if (project.id) {



      await update(
        project
      );



    }
    else {



      await create({

        ...project,

        id: crypto.randomUUID(),

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString(),

      });



    }


  }









  async function handleDelete(
    project: Project
  ) {



    const result =
      window.confirm(
        "Delete this project?"
      );



    if (!result)
      return;



    await remove(
      project.id
    );


  }









  return (



    <Box
      p={3}
    >





      <PageHeader


        title="Projects"



        subtitle=
        "Project Control and Performance Management"



        action={



          <Button


            variant="contained"



            startIcon={
              <AddRoundedIcon />
            }



            onClick={
              handleCreate
            }



          >

            New Project


          </Button>



        }



      />









      <PCSCard>




        {

          loading

          ?



          <Box


            display="flex"


            justifyContent="center"


            alignItems="center"


            minHeight={300}


          >


            <CircularProgress />


          </Box>



          :



          <ProjectTable

          rows={projects}

          loading={loading}


            onView={
              handleView
            }



            onEdit={
              handleEdit
            }



            onDelete={
              handleDelete
            }



          />

        }



      </PCSCard>









      <ProjectDialog



        open={
          open
        }



        project={
          selectedProject
        }



        onClose={()=>{


          setOpen(false);


          setSelectedProject(null);


        }}



        onSave={
          handleSave
        }



      />




    </Box>


  );


}