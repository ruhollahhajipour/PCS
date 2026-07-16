import type { Company } from "../types/company";

export const companyMock: Company[] = [

  {
    id:1,

    code:"KNG",

    name:"Kousha Gaman Namavar",

    shortName:"KNG",

    logo:"",

    country:"Iran",

    city:"Tehran",

    address:"Tehran",

    phone:"+98 21 000000",

    email:"info@kng.ir",

    website:"www.kng.ir",

    description:"Engineering Company",

    status:"Active",

    createdAt:new Date().toISOString(),

    updatedAt:new Date().toISOString(),
  }

];