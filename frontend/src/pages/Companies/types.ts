import type { Company } from "../../models/company";

export type CompanyStatus = "Active" | "Inactive";

export interface CompanyDialogState {
  open: boolean;
  mode: "create" | "edit";
  data?: Company;
}

export interface CompanyTableProps {
  rows: Company[];

  onView?: (row: Company) => void;

  onEdit?: (row: Company) => void;

  onDelete?: (row: Company) => void;
}

export interface CompanyToolbarProps {
  onAdd?: () => void;
}

export interface CompanyDialogProps {
  open: boolean;
  onClose: () => void;
}