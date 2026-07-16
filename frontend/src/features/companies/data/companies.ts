import type { Company } from "../../../models/company";

const companies: Company[] = [
  {
    id: 1,
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
    id: 2,
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

export default companies;