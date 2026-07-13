export type CompanyStatus =
  | "Active"
  | "Inactive";

export interface Company {
  id: number;
  code: string;
  name: string;
  englishName: string;
  status: CompanyStatus;
}