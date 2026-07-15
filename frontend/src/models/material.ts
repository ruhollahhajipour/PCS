export interface Material {
  id: number;

  code: string;

  name: string;

  description: string;

  category: string;

  unit: string;

  warehouse: string;

  minimumStock: number;

  currentStock: number;

  reservedStock: number;

  unitPrice: number;

  currency: string;

  manufacturer: string;

  status: "Available" | "Low Stock" | "Out of Stock";

  createdAt: string;

  updatedAt: string;
}