import type { BaseEntity } from "./base";

export interface Project extends BaseEntity {
  plantId: number;

  shortName: string;

  name: string;

  description: string;

  startDate: string;

  finishDate: string;

  budget: number;

  currency: string;
}