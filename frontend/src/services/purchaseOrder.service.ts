import type { PurchaseOrder } from "../models/purchaseOrder";

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    code: "PO-001",

    projectId: 1,
    vendorId: 1,

    poNumber: "PO-001",

    title: "Pipe Procurement",

    description: "API Pipes",

    orderDate: "2026-01-01",

    deliveryDate: "2026-02-15",

    currency: "USD",

    totalAmount: 250000,

    approvedAmount: 240000,

    receivedAmount: 180000,

    status: "Approved",

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  },
];

class PurchaseOrderService {
  async getAll() {
    return purchaseOrders;
  }

  async getById(id: number) {
    return purchaseOrders.find((x) => x.id === id);
  }

  async create(item: PurchaseOrder) {
    purchaseOrders.push(item);
    return item;
  }

  async update(item: PurchaseOrder) {
    const index = purchaseOrders.findIndex(
      (x) => x.id === item.id
    );

    if (index >= 0) {
      purchaseOrders[index] = item;
    }

    return item;
  }

  async delete(id: number) {
    const index = purchaseOrders.findIndex(
      (x) => x.id === id
    );

    if (index >= 0) {
      purchaseOrders.splice(index, 1);
    }
  }
}

export default new PurchaseOrderService();