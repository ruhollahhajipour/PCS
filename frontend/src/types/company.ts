export type CompanyStatus =
  | "Active"
  | "Inactive";

export interface Company {

  id: number;

  code: string;

  name: string;

  shortName: string;

  country: string;

  city: string;

  address: string;

  postalCode: string;

  phone: string;

  email: string;

  website: string;

  currency: string;

  fiscalYearStart: string;

  status: CompanyStatus;

  description: string;

  createdAt: string;

  updatedAt: string;

}