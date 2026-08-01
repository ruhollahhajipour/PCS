import { BaseCRUDRepository } from "../../../../core/repositories";
import type { InventoryCount } from "../types/inventoryCount";

export class InventoryCountRepository
  extends BaseCRUDRepository<InventoryCount> {

  constructor() {
    super("pcs_inventory_count");
  }

}

export const inventoryCountRepository =
  new InventoryCountRepository();