import http from "../../../api/http";
import type { CostItem } from "../types/costItem";

const API_URL = "/cost-items";

class CostService {
  async getAll(): Promise<CostItem[]> {
    const response =
      await http.get<CostItem[]>(
        API_URL
      );

    return response.data;
  }

  async create(
    item: CostItem
  ) {
    const response =
      await http.post(
        API_URL,
        item
      );

    return response.data;
  }

  async update(
    item: CostItem
  ) {
    const response =
      await http.put(
        `${API_URL}/${item.id}`,
        item
      );

    return response.data;
  }

  async delete(
    id: number
  ) {
    await http.delete(
      `${API_URL}/${id}`
    );
  }
}

export default new CostService();