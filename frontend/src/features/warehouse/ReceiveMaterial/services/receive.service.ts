import type { ReceiveMaterial } from "../types/receive";

const STORAGE_KEY = "pcs_receive_material";

export const receiveService = {
  async getAll(): Promise<ReceiveMaterial[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async create(item: ReceiveMaterial) {
    const list = await this.getAll();
    list.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  async update(item: ReceiveMaterial) {
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
  }
};