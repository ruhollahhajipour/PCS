import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";


import {
  ShoppingCartRounded,
  AssignmentRounded,
  AttachMoneyRounded,
  LocalShippingRounded,
} from "@mui/icons-material";


import ProcurementKPIs from "../components/ProcurementKPIs";


import {
  procurementMock,
} from "../data/procurement.mock";



interface KPIBoxProps {

  title: string;

  value: string | number;

  icon: React.ReactNode;

}



function KPIBox({
  title,
  value,
  icon,
}: KPIBoxProps) {


  return (

    <Paper

      sx={{

        p:3,

        borderRadius:4,

        display:"flex",

        alignItems:"center",

        gap:2,

        height:"100%",

        boxShadow:
          "0 8px 25px rgba(15,23,42,.08)"

      }}

    >


      <Box

        sx={{

          width:55,

          height:55,

          borderRadius:3,

          display:"flex",

          alignItems:"center",

          justifyContent:"center",

          bgcolor:"#DBEAFE",

          color:"#2563EB"

        }}

      >

        {icon}

      </Box>



      <Box>


        <Typography

          color="text.secondary"

          fontSize={14}

        >

          {title}

        </Typography>



        <Typography

          fontSize={24}

          fontWeight={800}

        >

          {value}

        </Typography>


      </Box>


    </Paper>

  );

}





export default function ProcurementDashboard(){



  const totalPR =
    procurementMock.length;



  const totalPO =
    procurementMock.filter(
      x => x.poNo !== ""
    ).length;



  const totalValue =
    procurementMock.reduce(
      (sum,item)=>
        sum + item.totalPrice,
      0
    );



  const delivered =
    procurementMock.filter(
      x =>
      x.status === "Delivered"
    ).length;



  const deliveryPercent =
    Math.round(

      delivered /
      Math.max(totalPR,1)
      *
      100

    );



  return (

    <Box>


      <Typography

        variant="h4"

        fontWeight={800}

        mb={3}

      >

        Procurement Dashboard

      </Typography>





      <Grid

        container

        spacing={3}

        mb={4}

      >



        <Grid size={{xs:12, md:3}}>

          <KPIBox

            title="Total PR"

            value={totalPR}

            icon={
              <AssignmentRounded />
            }

          />

        </Grid>




        <Grid size={{xs:12, md:3}}>


          <KPIBox

            title="Purchase Orders"

            value={totalPO}

            icon={
              <ShoppingCartRounded />
            }

          />


        </Grid>





        <Grid size={{xs:12, md:3}}>


          <KPIBox

            title="Total Value"

            value={
              `$${totalValue.toLocaleString()}`
            }

            icon={
              <AttachMoneyRounded />
            }

          />


        </Grid>





        <Grid size={{xs:12, md:3}}>


          <KPIBox

            title="Delivered"

            value={
              `${deliveryPercent}%`
            }

            icon={
              <LocalShippingRounded />
            }

          />


        </Grid>



      </Grid>





      <ProcurementKPIs

        totalPR={totalPR}

        totalPO={totalPO}

        totalValue={totalValue}

        delivered={deliveryPercent}

      />






      <Paper

        sx={{

          mt:4,

          p:4,

          borderRadius:4

        }}

      >


        <Typography

          variant="h6"

          fontWeight={700}

          mb={2}

        >

          Latest Procurement Activities

        </Typography>





        {
          procurementMock
          .slice(0,5)
          .map(item => (


            <Box

              key={item.id}

              sx={{

                py:2,

                borderBottom:
                "1px solid #E5E7EB"

              }}

            >


              <Typography

                fontWeight={700}

              >

                {item.prNo}
                {" - "}
                {item.description}

              </Typography>




              <Typography

                color="text.secondary"

              >

                Vendor:
                {" "}
                {item.vendor}

                {" | "}

                Status:
                {" "}
                {item.status}


              </Typography>



            </Box>



          ))
        }


      </Paper>



    </Box>

  );

}