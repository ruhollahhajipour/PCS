export interface Plant {
  id: string;

  code: string;

  name: string;

  shortName?: string | null;

  description?: string | null;

  companyId: string;

  address?: string | null;

  phone?: string | null;

  email?: string | null;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}