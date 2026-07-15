import type { PurchaseOrder } from "../models/purchaseOrder";

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    companyId: 1,
    plantId: 1,
    projectId: 1,
    poNumber: "PO-2026-001",
    vendorId: 1,
    description: "Process Equipment",
    currency: "USD",
    amount: 1250000,
    issueDate: "2026-07-01",
    deliveryDate: "2026-09-15",
    buyer: "Procurement Department",
    status: "Issued",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-10",
  },
  {
    id: 2,
    companyId: 1,
    plantId: 1,
    projectId: 2,
    poNumber: "PO-2026-002",
    vendorId: 2,
    description: "Electrical Materials",
    currency: "USD",
    amount: 640000,
    issueDate: "2026-07-08",
    deliveryDate: "2026-10-01",
    buyer: "Procurement Department",
    status: "Approved",
    createdAt: "2026-07-08",
    updatedAt: "2026-07-12",
  },
];

class PurchaseOrderService {
  async getAll(): Promise<PurchaseOrder[]> {
    return Promise.resolve(purchaseOrders);
  }

  async getById(
    id: number
  ): Promise<PurchaseOrder | undefined> {
    return Promise.resolve(
      purchaseOrders.find((p) => p.id === id)
    );
  }

  async create(
    purchaseOrder: PurchaseOrder
  ): Promise<PurchaseOrder> {
    purchaseOrders.push(purchaseOrder);
    return Promise.resolve(purchaseOrder);
  }

  async update(
    purchaseOrder: PurchaseOrder
  ): Promise<PurchaseOrder> {
    const index = purchaseOrders.findIndex(
      (p) => p.id === purchaseOrder.id
    );

    if (index >= 0) {
      purchaseOrders[index] = purchaseOrder;
    }

    return Promise.resolve(purchaseOrder);
  }

  async delete(id: number): Promise<void> {
    const index = purchaseOrders.findIndex(
      (p) => p.id === id
    );

    if (index >= 0) {
      purchaseOrders.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new PurchaseOrderService();