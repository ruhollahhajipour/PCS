import type { WarehouseItem } from "../types/warehouse";

let warehouseItems: WarehouseItem[] = [];

export async function getWarehouseItems() {
  return warehouseItems;
}

export async function createWarehouseItem(
  item: WarehouseItem
) {
  warehouseItems.unshift(item);
}

export async function updateWarehouseItem(
  item: WarehouseItem
) {
  warehouseItems = warehouseItems.map((x) =>
    x.id === item.id ? item : x
  );
}

export async function deleteWarehouseItem(
  id: number
) {
  warehouseItems = warehouseItems.filter(
    (x) => x.id !== id
  );
}