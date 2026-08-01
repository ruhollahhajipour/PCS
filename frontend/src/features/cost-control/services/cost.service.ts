import type { CostItem } from "../types/costItem";


const API_URL =
  "http://localhost:5000/api/cost-items";


class CostService {


  async getAll(): Promise<CostItem[]> {

    const response =
      await fetch(API_URL);


    if(!response.ok){
      throw new Error(
        "Failed to load cost items"
      );
    }


    return response.json();

  }



  async create(
    item: CostItem
  ) {


    const response =
      await fetch(
        API_URL,
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(item),
        }
      );


    if(!response.ok){
      throw new Error(
        "Create failed"
      );
    }

  }




  async update(
    item: CostItem
  ) {


    const response =
      await fetch(
        `${API_URL}/${item.id}`,
        {
          method:"PUT",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(item),
        }
      );


    if(!response.ok){
      throw new Error(
        "Update failed"
      );
    }

  }




  async delete(
    id:number
  ){

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method:"DELETE",
        }
      );


    if(!response.ok){
      throw new Error(
        "Delete failed"
      );
    }

  }

}


export default new CostService();