export interface Stock {

  id: number;

  warehouse: string;

  location: string;

  itemCode: string;

  itemName: string;

  category: string;

  unit: string;

  receivedQty: number;

  issuedQty: number;

  transferInQty: number;

  transferOutQty: number;

  adjustmentQty: number;

  currentQty: number;

  reservedQty: number;

  availableQty: number;

  reorderPoint: number;

  safetyStock: number;

  lastUpdated: string;

}