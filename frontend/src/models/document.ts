export interface Document {
  id: number;

  companyId: number;

  plantId: number;

  projectId: number;

  documentNo: string;

  title: string;

  discipline: string;

  revision: string;

  type: string;

  status:
    | "Draft"
    | "Review"
    | "Approved"
    | "Issued";

  fileName: string;

  fileSize: number;

  createdBy: string;

  approvedBy?: string;

  issueDate?: string;

  createdAt: string;

  updatedAt: string;
}