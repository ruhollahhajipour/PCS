import type { BaseEntity } from "./base";

export interface Material extends BaseEntity {
  warehouseId: number;

  code: string;

  shortName: string;

  name: string;

  category: string;

  unit: string;

  specification: string;

  manufacturer: string;

  partNumber: string;

  minStock: number;

  maxStock: number;

  currentStock: number;

  unitPrice: number;

  currency: string;
}