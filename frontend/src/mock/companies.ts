import type { Company } from "../models/company";

export const companies: Company[] = [
  {
    id: 1,
    code: "CMP-001",
    shortName: "ADISH",
    name: "Adish Gas Condensate Refinery",
    country: "Iran",
    city: "Bushehr",
    address: "South Pars Energy Zone",
    currency: "USD",
    status: "Active",
    registrationNumber: "REG-001",
    taxNumber: "TAX-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: 2,
    code: "CMP-002",
    shortName: "PARS",
    name: "Pars Energy",
    country: "Iran",
    city: "Tehran",
    address: "Tehran",
    currency: "USD",
    status: "Inactive",
    registrationNumber: "REG-002",
    taxNumber: "TAX-002",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];