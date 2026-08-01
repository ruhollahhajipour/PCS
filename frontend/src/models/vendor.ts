import type { BaseEntity } from "./base";

export interface Vendor extends BaseEntity {
  code: string;

  shortName: string;

  name: string;

  country: string;

  city: string;

  address: string;

  contactPerson: string;

  phone: string;

  email: string;

  website: string;

  registrationNumber: string;

  taxNumber: string;

  currency: string;

  paymentTerm: string;

  rating: number;
}