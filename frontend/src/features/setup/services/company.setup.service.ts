import axios from "axios";


export interface CreateCompanyRequest {

  code: string;

  name: string;

  nationalId?: string;

  address?: string;

  phone?: string;

  email?: string;

}



class CompanySetupService {


  async create(
    data: CreateCompanyRequest
  ): Promise<string> {


    const response =
      await axios.post<string>(
        "http://localhost:5201/api/Companies",
        data
      );


    return response.data;


  }


}


export default new CompanySetupService();