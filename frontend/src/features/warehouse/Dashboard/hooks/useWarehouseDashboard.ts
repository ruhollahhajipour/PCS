import { useEffect, useState }
from "react";


import { warehouseDashboardService }
from "../services/warehouseDashboard.service";


import type { WarehouseDashboardSummary }
from "../types/warehouseDashboard";



export function useWarehouseDashboard(){



 const [

   summary,

   setSummary

 ] = useState<WarehouseDashboardSummary | null>(null);



 const [

   loading,

   setLoading

 ] = useState(false);





 const load = async()=>{


   try {


     setLoading(true);



     const data =

       await warehouseDashboardService
       .getSummary();



     setSummary(data);



   }

   finally {


     setLoading(false);


   }


 };





 useEffect(()=>{


   load();


 },[]);





 return {


   summary,

   loading,

   reload:load


 };


}