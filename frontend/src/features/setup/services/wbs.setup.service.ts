import axios from "axios";


const API =
  "http://localhost:5201/api/pms";



class WbsSetupService {


  async downloadTemplate(){


    const response =
      await axios.get(

        `${API}/template`,

        {

          responseType:
            "blob"

        }

      );


    return response.data;

  }






  async importExcel(

    projectId:string,

    file:File

  ){


    const formData =
      new FormData();



    formData.append(
      "file",
      file
    );



    const response =
      await axios.post(

        `${API}/import?projectId=${projectId}`,

        formData,

        {

          headers:{

            "Content-Type":
              "multipart/form-data"

          }

        }

      );



    return response.data;


  }


}



export default new WbsSetupService();