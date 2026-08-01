import {
 stockCalculationService
}
from "../services/stockCalculation.service";



export function useStockCalculation(){


 return {


  calculateCurrentQty:
  stockCalculationService.calculateCurrentQty,


  calculateAvailableQty:
  stockCalculationService.calculateAvailableQty,


  calculateStockStatus:
  stockCalculationService.calculateStockStatus


 };


}