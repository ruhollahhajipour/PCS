import axios from "axios";


export interface CreateProjectRequest {


  code:string;

  name:string;

  description?:string;

  companyId:string;

  startDate:string;

  endDate:string;

  budget:number;


}



class ProjectSetupService {


  async create(
    data:CreateProjectRequest
  ){


    const response =
      await axios.post(

        "http://localhost:5201/api/Projects",

        data

      );


    return response.data;


  }


}


export default new ProjectSetupService();