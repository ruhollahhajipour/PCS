import { useSyncExternalStore } from "react";
import { warehouseStore } from "../services/warehouse.service";
import type { WarehouseSnapshot } from "../types/warehouse";

/** Subscribes a component to the warehouse store. */
export function useWarehouse(): WarehouseSnapshot {
  return useSyncExternalStore(
    warehouseStore.subscribe,
    warehouseStore.getSnapshot,
  );
}
