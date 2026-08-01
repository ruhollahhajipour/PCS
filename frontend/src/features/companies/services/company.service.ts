import type { Company } from "../../../models/company";


const companies: Company[] = [

{
 id: crypto.randomUUID(),

 code:"ADISH",

 name:"South Adish Gas Condensate Refinery",

 nationalId:"0000000000",

 address:"Iran",

 phone:"",

 email:"",

 logo:"",

 status:"Active",

 createdAt:new Date().toISOString(),

 updatedAt:new Date().toISOString()

}

];



class CompanyService {


async getAll(){

 return companies;

}



async getById(
 id:string
){

 return companies.find(
  x=>x.id===id
 );

}



async create(
 company:Company
){

 companies.push(company);

}



async update(
 company:Company
){

 const index =
 companies.findIndex(
  x=>x.id===company.id
 );


 if(index>=0)
  companies[index]=company;

}



async delete(
 id:string
){

 const index =
 companies.findIndex(
  x=>x.id===id
 );


 if(index>=0)
  companies.splice(index,1);

}


}


export default new CompanyService();