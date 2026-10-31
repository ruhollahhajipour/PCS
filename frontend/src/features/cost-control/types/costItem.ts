export interface CostItem {
  id: number;

  projectId?: number;

  wbs: string;

  project: string;

  discipline: string;

  costCode?: string;

  budget: number;          // BAC

  commitment: number;

  actual: number;          // AC

  forecast: number;        // EAC

  variance: number;        // VAC

  progress: number;

  plannedValue?: number;   // PV

  earnedValue?: number;    // EV

  spi?: number;

  cpi?: number;

  estimateToComplete?: number; // ETC

  scheduleVariance?: number;   // SV

  costVariance?: number;       // CV

  financialProgress?: number;

  remarks?: string;

  status:
    | "Normal"
    | "Warning"
    | "Critical";

  updatedAt: string;
}