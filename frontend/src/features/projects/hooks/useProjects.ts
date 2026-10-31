import {
  useEffect,
  useState,
} from "react";


import ProjectService
from "../services/project.service";


import type { Project }
from "../../../models/project";







export default function useProjects(){





  const [projects,setProjects] =
    useState<Project[]>([]);





  const [loading,setLoading] =
    useState(true);







  async function load(){



    try{


      setLoading(true);



      const data =
        await ProjectService.getAll();



      setProjects(
        data
      );



    }
    catch(error){



      console.error(

        "Failed to load projects",

        error

      );



      setProjects([]);



    }
    finally{


      setLoading(false);


    }



  }









  useEffect(()=>{


    load();


  },[]);









  async function create(
    project:Project
  ){



    try{


      setLoading(true);



      await ProjectService.create(

        project

      );



      await load();



    }
    finally{


      setLoading(false);


    }



  }









  async function update(
    project:Project
  ){



    try{


      setLoading(true);



      await ProjectService.update(

        project

      );



      await load();



    }
    finally{


      setLoading(false);


    }



  }









  async function remove(
    id:string
  ){



    try{


      setLoading(true);



      await ProjectService.delete(

        id

      );



      await load();



    }
    finally{


      setLoading(false);


    }



  }









  return {


    projects,


    loading,


    reload:load,


    create,


    update,


    remove,


  };



}