import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";


import { useStock } from "../hooks/useStock";


import StockKPICards
from "../components/StockKPICards";


import StockStatusChip
from "../components/StockStatusChip";


import PageHeader
from "../../../../components/Common/PageHeader";




export default function StockPage() {



  const {

    stocks,

    loading,

    error

  } = useStock();





  if (loading) {


    return (

      <Typography>

        Loading Stock...

      </Typography>

    );

  }





  if (error) {


    return (

      <Typography color="error">

        {error}

      </Typography>

    );

  }





  const totalItems = stocks.length;



  const totalQuantity = stocks.reduce(

    (sum, item) =>

      sum + item.currentQty,

    0

  );




  const lowStock = stocks.filter(

    item =>

      item.currentQty <= item.reorderPoint

  ).length;





  const critical = stocks.filter(

    item =>

      item.currentQty <= item.safetyStock

  ).length;







  return (



    <Box>



      <PageHeader

        title="Stock"

        subtitle="Inventory position and availability"

      />






      <Box sx={{ mt: 3 }}>



        <StockKPICards


          totalItems={totalItems}


          totalQuantity={totalQuantity}


          lowStock={lowStock}


          critical={critical}


        />



      </Box>








      <TableContainer


        component={Paper}


        sx={{


          mt: 4,


          borderRadius: 3


        }}


      >



        <Table>





          <TableHead>



            <TableRow>



              <TableCell>
                Item Code
              </TableCell>



              <TableCell>
                Item Name
              </TableCell>



              <TableCell>
                Category
              </TableCell>



              <TableCell>
                Warehouse
              </TableCell>



              <TableCell>
                Current Qty
              </TableCell>



              <TableCell>
                Available
              </TableCell>



              <TableCell>
                Reorder Point
              </TableCell>



              <TableCell>
                Status
              </TableCell>



            </TableRow>



          </TableHead>








          <TableBody>



            {stocks.map(item => (




              <TableRow

                key={item.id}

              >




                <TableCell>

                  {item.itemCode}

                </TableCell>





                <TableCell>

                  {item.itemName}

                </TableCell>





                <TableCell>

                  {item.category}

                </TableCell>





                <TableCell>

                  {item.warehouse}

                </TableCell>





                <TableCell>

                  {item.currentQty}

                </TableCell>





                <TableCell>

                  {item.availableQty}

                </TableCell>





                <TableCell>

                  {item.reorderPoint}

                </TableCell>





                <TableCell>



                  <StockStatusChip


                    currentQty={item.currentQty}


                    reorderPoint={item.reorderPoint}


                    safetyStock={item.safetyStock}


                  />



                </TableCell>





              </TableRow>




            ))}





          </TableBody>





        </Table>





      </TableContainer>





    </Box>



  );


}