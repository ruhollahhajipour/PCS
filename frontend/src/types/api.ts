export interface ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;
}

export interface ApiError {
  success: false;

  message: string;

  errors?: string[];
}

export interface PaginationRequest {
  page: number;

  pageSize: number;

  search?: string;

  sortBy?: string;

  sortDirection?: "asc" | "desc";
}

export interface PaginationResponse<T> {
  items: T[];

  totalItems: number;

  totalPages: number;

  currentPage: number;

  pageSize: number;
}

export interface ApiListResponse<T> {
  success: boolean;

  message: string;

  data: PaginationResponse<T>;
}