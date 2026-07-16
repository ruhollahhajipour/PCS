import type { Project } from "../models/project";

const projects: Project[] = [
  {
    id: 1,
    plantId: 1,

    code: "PRJ-001",
    shortName: "OFFSITE",

    name: "Offsite Facilities",

    description: "Utilities & Offsite",

    startDate: "2026-01-01",
    finishDate: "2028-12-31",

    budget: 25000000,

    currency: "USD",

    status: "Active",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: 2,
    plantId: 1,

    code: "PRJ-002",
    shortName: "PROCESS",

    name: "Process Units",

    description: "Main Process Area",

    startDate: "2026-03-01",
    finishDate: "2029-01-15",

    budget: 42000000,

    currency: "USD",

    status: "Active",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default projects;