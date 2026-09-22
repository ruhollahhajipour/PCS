import type { BaseEntity } from "./base";

export interface Company extends BaseEntity {
  name: string;

  nationalId?: string;

  address?: string;

  phone?: string;

  email?: string;
}