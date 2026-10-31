import type { Issue } from "../types/issue";

const STORAGE_KEY = "pcs_issue_material";

export const issueService = {

  async getAll(): Promise<Issue[]> {

    const raw = localStorage.getItem(STORAGE_KEY);

    return raw ? JSON.parse(raw) : [];

  },

  async create(item: Issue) {

    const list = await this.getAll();

    list.push(item);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    );

  },

  async update(item: Issue) {

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