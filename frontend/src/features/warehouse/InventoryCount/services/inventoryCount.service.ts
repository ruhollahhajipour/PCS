import type { InventoryCount } from "../types/inventoryCount";

const STORAGE_KEY = "pcs_inventory_count";

export const inventoryCountService = {

  async getAll(): Promise<InventoryCount[]> {

    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : [];

  },

  async create(item: InventoryCount) {

    const list = await this.getAll();

    list.push(item);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    );

  },

  async update(item: InventoryCount) {

    const list = await this.getAll();

    const index = list.findIndex(
      x => x.id === item.id
    );

    if (index >= 0)
      list[index] = item;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    );

  },

  async remove(id: number) {

    const list = await this.getAll();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        list.filter(x => x.id !== id)
      )
    );

  },

};