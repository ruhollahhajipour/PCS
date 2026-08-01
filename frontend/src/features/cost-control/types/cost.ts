export interface CostRecord {
  id: number;

  projectId: number;

  wbs?: string;

  period: string;

  plannedValue: number; // PV

  earnedValue: number; // EV

  actualCost: number; // AC

  budgetAtCompletion: number; // BAC

  estimateAtCompletion?: number; // EAC

  estimateToComplete?: number; // ETC

  varianceAtCompletion?: number; // VAC

  scheduleVariance?: number; // SV

  costVariance?: number; // CV

  schedulePerformanceIndex?: number; // SPI

  costPerformanceIndex?: number; // CPI

  physicalProgress: number;

  financialProgress: number;

  forecastProgress: number;

  remarks?: string;

  createdAt?: string;

  updatedAt?: string;
}