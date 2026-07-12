import { Company } from "../types/company";

export const companies: Company[] = [
  {
    id: 1,
    code: "ADS001",
    name: "Adish South Refinery",
    industry: "Oil & Gas",
    country: "Iran",
    city: "Bushehr",
    plants: 4,
    projects: 11,
    users: 32,
    status: "Active",
  },

  {
    id: 2,
    code: "MAP001",
    name: "MAPNA Group",
    industry: "Power",
    country: "Iran",
    city: "Tehran",
    plants: 8,
    projects: 19,
    users: 51,
    status: "Active",
  },

  {
    id: 3,
    code: "MSC001",
    name: "Mobarakeh Steel",
    industry: "Steel",
    country: "Iran",
    city: "Isfahan",
    plants: 5,
    projects: 7,
    users: 18,
    status: "Inactive",
  },
];