import type { Stock } from "../types/stock";


export const stockMockData: Stock[] = [

  {
    id: 1,

    warehouse: "Main Warehouse",

    location: "A-01",

    itemCode: "BRG-6205",

    itemName: "Bearing 6205",

    category: "Mechanical Spare",

    unit: "PCS",

    receivedQty: 500,

    issuedQty: 120,

    transferInQty: 50,

    transferOutQty: 20,

    adjustmentQty: -5,

    currentQty: 0,

    reservedQty: 10,

    availableQty: 0,

    reorderPoint: 100,

    safetyStock: 50,

    lastUpdated: "2026-07-24"

  },


  {

    id: 2,

    warehouse: "Main Warehouse",

    location: "B-12",

    itemCode: "SEAL-PUMP-01",

    itemName: "Pump Mechanical Seal",

    category: "Rotating Equipment",

    unit: "PCS",

    receivedQty: 80,

    issuedQty: 65,

    transferInQty: 0,

    transferOutQty: 5,

    adjustmentQty: 0,

    currentQty: 0,

    reservedQty: 5,

    availableQty: 0,

    reorderPoint: 30,

    safetyStock: 15,

    lastUpdated: "2026-07-24"

  },


  {

    id: 3,

    warehouse: "Electrical Warehouse",

    location: "E-05",

    itemCode: "CBL-4C-16",

    itemName: "Power Cable 4C x 16mm",

    category: "Electrical",

    unit: "M",

    receivedQty: 1000,

    issuedQty: 300,

    transferInQty: 200,

    transferOutQty: 0,

    adjustmentQty: 0,

    currentQty: 0,

    reservedQty: 100,

    availableQty: 0,

    reorderPoint: 250,

    safetyStock: 100,

    lastUpdated: "2026-07-24"

  }

];