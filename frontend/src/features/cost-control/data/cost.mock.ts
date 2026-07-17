import type { CostItem } from "../types/costItem";

export const costMock: CostItem[] = [
  {
    id: 1,

    wbs: "1.1.1",

    project: "Gas Condensate Refinery",

    discipline: "Civil",

    budget: 250000000,

    commitment: 190000000,

    actual: 172000000,

    forecast: 241000000,

    variance: 9000000,

    progress: 69,

    status: "Normal",

    updatedAt: "2026-07-17",
  },

  {
    id: 2,

    wbs: "1.2.4",

    project: "Gas Condensate Refinery",

    discipline: "Mechanical",

    budget: 410000000,

    commitment: 398000000,

    actual: 392000000,

    forecast: 448000000,

    variance: -38000000,

    progress: 94,

    status: "Critical",

    updatedAt: "2026-07-17",
  },

  {
    id: 3,

    wbs: "2.1.3",

    project: "Gas Condensate Refinery",

    discipline: "Electrical",

    budget: 160000000,

    commitment: 133000000,

    actual: 129000000,

    forecast: 154000000,

    variance: 6000000,

    progress: 81,

    status: "Warning",

    updatedAt: "2026-07-17",
  },
];