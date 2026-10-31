import type { Plant } from "../../../models/plant";

const now = new Date().toISOString();

const plants: Plant[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    companyId: "00000000-0000-0000-0000-000000000001",

    code: "ADISH-01",
    name: "South Adish Gas Condensate Refinery",
    shortName: "ADS",

    description: "South Adish Gas Condensate Refinery",

    address: "South Pars Phase 13",
    phone: "",
    email: "",

    isActive: true,

    createdAt: now,
    updatedAt: now,
  },

  {
    id: "00000000-0000-0000-0000-000000000002",
    companyId: "00000000-0000-0000-0000-000000000001",

    code: "UTIL-01",
    name: "Utility Plant",
    shortName: "UTL",

    description: "Utility Plant",

    address: "South Pars",
    phone: "",
    email: "",

    isActive: true,

    createdAt: now,
    updatedAt: now,
  },

  {
    id: "00000000-0000-0000-0000-000000000003",
    companyId: "00000000-0000-0000-0000-000000000002",

    code: "PETRO-01",
    name: "Petrochemical Unit",
    shortName: "PET",

    description: "Petrochemical Unit",

    address: "Assaluyeh Industrial Zone",
    phone: "",
    email: "",

    isActive: false,

    createdAt: now,
    updatedAt: now,
  },
];

export default plants;