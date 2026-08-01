import type { Project }
from "../../../models/project";


export const projects: Project[] = [

  {
    id:
      "00000000-0000-0000-0000-000000000001",

    code:
      "PCS-001",

    shortName:
      "DEMO",

    name:
      "PCS Demo Project",

    description:
      "Demo project for testing",


    companyId:
      "00000000-0000-0000-0000-000000000001",


    plantId:
      "00000000-0000-0000-0000-000000000001",


    contractNo:
      "CNT-001",


    client:
      "Adish Jonubi",


    contractor:
      "PCS Contractor",


    consultant:
      "PCS Consultant",


    startDate:
      "2026-01-01",


    endDate:
      "2027-01-01",


    budget:
      10000000,


    actualCost:
      0,


    currency:
      "USD",


    progress:
      0,


    spi:
      1,


    cpi:
      1,


    status:
      "Active",


    isActive:
      true,


    createdAt:
      new Date().toISOString(),


    updatedAt:
      new Date().toISOString()

  }

];


export default projects;