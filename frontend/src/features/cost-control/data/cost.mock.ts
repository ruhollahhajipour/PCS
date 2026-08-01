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
];