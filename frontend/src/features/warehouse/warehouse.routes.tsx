import type { RouteObject }
from "react-router-dom";


import {

  WarehouseDashboard,

  StockPage

}

from "./index";



export const warehouseRoutes: RouteObject[] = [



  {

    path: "warehouse/dashboard",

    element:

      <WarehouseDashboard />

  },



  {

    path: "warehouse/stock",

    element:

      <StockPage />

  }



];