export interface BaseEntity {
  id: number;

  code: string;

  status: "Active" | "Inactive";

  createdAt: string;

  updatedAt: string;
}