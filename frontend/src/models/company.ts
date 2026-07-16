import type { BaseEntity } from "./base";

export interface Company extends BaseEntity {
  shortName: string;

  name: string;

  country: string;

  city: string;

  address: string;

  currency: string;

  registrationNumber: string;

  taxNumber: string;
}