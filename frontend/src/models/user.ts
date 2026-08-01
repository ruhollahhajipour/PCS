export interface User {
  id: number;

  companyId: number;

  plantId: number;

  projectId: number;

  username: string;

  fullName: string;

  email: string;

  mobile: string;

  department: string;

  position: string;

  role: string;

  avatar?: string;

  status: "Active" | "Inactive";

  lastLogin?: string;

  createdAt: string;

  updatedAt: string;
}