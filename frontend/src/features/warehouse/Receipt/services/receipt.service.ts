import type { Receipt } from "../types/receipt";

const STORAGE_KEY = "pcs_receipts";

function load(): Receipt[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function save(items: Receipt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const receiptService = {

  async getAll(): Promise<Receipt[]> {
    return load();
  },

  async create(item: Receipt): Promise<void> {
    const items = load();
    items.push(item);
    save(items);
  },

  async update(item: Receipt): Promise<void> {
    const items = load().map(x =>
      x.id === item.id ? item : x
    );
    save(items);
  },

  async remove(id: number): Promise<void> {
    const items = load().filter(x => x.id !== id);
    save(items);
  },

};