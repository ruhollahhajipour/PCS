export interface Company {
  id: number;
  code: string;
  name: string;
  industry: string;
  country: string;
  city: string;
  logo?: string;
  plants: number;
  projects: number;
  users: number;
  status: "Active" | "Inactive";
}