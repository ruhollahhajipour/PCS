export interface Company {

  id: number;

  code: string;

  name: string;

  shortName: string;

  logo?: string;

  country: string;

  city: string;

  address: string;

  phone: string;

  email: string;

  website: string;

  description: string;

  status: "Active" | "Inactive";

  createdAt: string;

  updatedAt: string;
}