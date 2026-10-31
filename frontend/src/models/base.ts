export interface BaseEntity {

  id: string;

  code: string;

  status:
    | "Active"
    | "Inactive";

  createdAt: string;

  updatedAt: string;

}