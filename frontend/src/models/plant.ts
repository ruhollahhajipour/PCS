import type { BaseEntity } from "./base";

export interface Plant extends BaseEntity {
  companyId: number;

  shortName: string;

  name: string;

  country: string;

  city: string;

  address: string;

  timezone: string;

  currency: string;
}