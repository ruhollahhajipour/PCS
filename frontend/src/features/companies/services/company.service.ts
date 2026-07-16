import type { Company } from "../types/company";

import { companyMock } from "../data/company.mock";

class CompanyService{

  private data=[...companyMock];

  async getAll(){

    return [...this.data];

  }

  async create(company:Company){

    this.data.push(company);

  }

  async update(company:Company){

    this.data=this.data.map(x=>x.id===company.id?company:x);

  }

  async delete(id:number){

    this.data=this.data.filter(x=>x.id!==id);

  }

}

export default new CompanyService();