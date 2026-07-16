import type { BaseEntity } from "./base";

export interface Warehouse extends BaseEntity {
  plantId: number;

  shortName: string;

  name: string;

  location: string;

  manager: string;

  description: string;
}