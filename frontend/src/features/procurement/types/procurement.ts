export interface Procurement {

  id: number;


  prNo: string;

  poNo: string;



  // Optional source of procurement request
  source?:
    | "MANUAL"
    | "WAREHOUSE_REORDER";


  sourceId?: number;



  project: string;


  vendor: string;


  discipline: string;

  buyer: string;



  itemCode: string;

  description: string;



  quantity: number;

  unit: string;



  unitPrice: number;

  totalPrice: number;

  currency: string;



  requestedDate: string;

  requiredDate: string;

  deliveryDate: string;



  progress: number;



  status:
    | "Draft"
    | "RFQ"
    | "Bid Evaluation"
    | "Awarded"
    | "In Progress"
    | "Delivered"
    | "Closed"
    | "Cancelled";



  remarks: string;



  createdAt: string;

  updatedAt: string;

}