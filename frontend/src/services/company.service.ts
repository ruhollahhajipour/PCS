import type { Company } from "../models/company";


let companies: Company[] = [
  {
    id: "1",
    code: "KGN",
    shortName: "KGN",
    name: "Kousha Gaman Namavar",
    country: "Iran",
    city: "Tehran",
    address: "Tehran, Iran",
    currency: "USD",
    status: "Active",
    registrationNumber: "101025487",
    taxNumber: "TAX-001",
    createdAt: "2026-01-01",
    updatedAt: "2026-07-10",
  },

  {
    id: "2",
    code: "ADISH",
    shortName: "ADISH",
    name: "South Adish Gas Condensate Refinery",
    country: "Iran",
    city: "Bushehr",
    address: "Bushehr Province",
    currency: "USD",
    status: "Active",
    registrationNumber: "101025488",
    taxNumber: "TAX-002",
    createdAt: "2026-01-02",
    updatedAt: "2026-07-10",
  },
];



class CompanyService {


  async getAll(): Promise<Company[]> {

    return companies;

  }



  async getById(
    id: string
  ): Promise<Company | undefined> {

    return companies.find(
      (c) => c.id === id
    );

  }



  async create(
    company: Company
  ): Promise<Company> {


    const newCompany: Company = {

      ...company,

      id: crypto.randomUUID(),

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

    };


    companies.push(newCompany);


    return newCompany;

  }




  async update(
    company: Company
  ): Promise<Company | undefined> {


    const index =
      companies.findIndex(
        (c) => c.id === company.id
      );


    if(index === -1)
      return undefined;



    companies[index] = {

      ...company,

      updatedAt:
        new Date().toISOString(),

    };


    return companies[index];

  }




  async delete(
    id: string
  ): Promise<void> {


    companies =
      companies.filter(
        (c) => c.id !== id
      );

  }


}


export default new CompanyService();