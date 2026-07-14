export interface Company {
  id: number;
  code: string;
  name: string;
  country: string;
  projects: number;
  status: "Active" | "Inactive";
}