export interface BaseEntity {
  id: number;

  createdAt?: string;

  updatedAt?: string;
}

export interface LookupItem {
  id: number;

  code: string;

  name: string;
}

export interface ApiResponse<T> {
  success: boolean;

  message?: string;

  data: T;
}

export interface Pagination {
  page: number;

  pageSize: number;

  total: number;
}

export interface ApiListResponse<T> {
  items: T[];

  pagination: Pagination;
}

export interface SelectOption {
  label: string;

  value: string | number;
}