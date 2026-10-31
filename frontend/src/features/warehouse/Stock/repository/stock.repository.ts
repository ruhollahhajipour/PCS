import { BaseCRUDRepository } from "../../../../core/repositories";
import type { Stock } from "../types/stock";


export class StockRepository
extends BaseCRUDRepository<Stock>{


constructor(){

super("pcs_stock");

}



calculateAvailableStock(
stock:Stock
):number{


return (

stock.currentQty -
stock.reservedQty

);


}



calculateStockValue(
stock:Stock
):number{


return (

stock.currentQty *

0

);


}



updateCalculatedFields(
stock:Stock
):Stock{


return {


...stock,


availableQty:
this.calculateAvailableStock(stock),



lastUpdated:
new Date().toISOString()


};


}



}


export const stockRepository =
new StockRepository();