export interface Vendor {
  id: number;

  code: string;

  name: string;

  shortName: string;

  country: string;

  city: string;

  address: string;

  contactPerson: string;

  email: string;

  phone: string;

  website: string;

  taxNumber: string;

  registrationNumber: string;

  status: "Active" | "Inactive";

  createdAt: string;

  updatedAt: string;
}