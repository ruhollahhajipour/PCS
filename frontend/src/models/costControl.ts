import type { BaseEntity } from "./base";

export interface CostControl
  extends BaseEntity {
  projectId: number;

  wbs: string;

  costCode: string;

  discipline: string;

  description: string;

  budget: number;

  committed: number;

  actual: number;

  forecast: number;

  remaining: number;

  variance: number;

  currency: string;

  period: string;
}