import type { Plant } from "../services/plant.service";

const plants: Plant[] = [
  {
    id: 1,
    companyId: 1,
    code: "ADISH-01",
    name: "South Adish Gas Condensate Refinery",
    location: "Bushehr",
    status: "Active",
  },
  {
    id: 2,
    companyId: 1,
    code: "UTIL-01",
    name: "Utility Plant",
    location: "Bushehr",
    status: "Active",
  },
  {
    id: 3,
    companyId: 2,
    code: "PETRO-01",
    name: "Petrochemical Unit",
    location: "Assaluyeh",
    status: "Inactive",
  },
];

export default plants;