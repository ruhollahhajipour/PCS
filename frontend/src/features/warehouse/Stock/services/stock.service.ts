import {
  stockRepository
} from "../repository/stock.repository";


import type {
  Stock
} from "../types/stock";



export class StockService {



  async getAll(): Promise<Stock[]> {

    return stockRepository.getAll();

  }



  async getStock(): Promise<Stock[]> {

    return this.getAll();

  }



  calculateCurrentStock(
    stock: Stock
  ): number {


    return (

      stock.receivedQty
      -
      stock.issuedQty
      +
      stock.transferInQty
      -
      stock.transferOutQty
      +
      stock.adjustmentQty

    );


  }



  calculateStock(
    stock: Stock
  ): Stock {


    const currentQty =
      this.calculateCurrentStock(stock);



    return {


      ...stock,


      currentQty,


      availableQty:
      currentQty - stock.reservedQty,


      lastUpdated:
      new Date().toISOString()


    };


  }




  getTotalQuantity(
    stocks: Stock[]
  ): number {


    return stocks.reduce(

      (sum,item)=>
      sum + item.currentQty,

      0

    );


  }




  getLowStockItems(
    stocks: Stock[]
  ): Stock[] {


    return stocks.filter(

      item =>

      item.availableQty <=
      item.reorderPoint

    );


  }




  getCriticalStockItems(
    stocks: Stock[]
  ): Stock[] {


    return stocks.filter(

      item =>

      item.availableQty <=
      item.safetyStock

    );


  }




  getInventoryValue(
    stocks: Stock[]
  ): number {


    return stocks.reduce(

      (sum,item)=>

      sum + item.currentQty,

      0

    );


  }



  async getById(
    id:number
  ){

    return stockRepository.getById(id);

  }



  async save(
    stock:Stock
  ){

    await stockRepository.update(stock);

  }



}



export const stockService =
new StockService();