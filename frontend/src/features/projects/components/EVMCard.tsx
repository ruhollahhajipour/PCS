import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import type { EVMResult } from "../utils/evmCalculator";



type Props = {

  data:EVMResult;

};







export default function EVMCard({

  data,

}:Props){



  const items = [


    {
      title:"Planned Value (PV)",
      value:data.PV,
    },


    {
      title:"Earned Value (EV)",
      value:data.EV,
    },


    {
      title:"Actual Cost (AC)",
      value:data.AC,
    },


    {
      title:"Cost Variance (CV)",
      value:data.CV,
    },


    {
      title:"Schedule Variance (SV)",
      value:data.SV,
    },


  ];






  return (


    <Card

      sx={{

        borderRadius:4,

      }}

    >


      <CardContent>



        <Typography

          variant="h6"

          fontWeight={700}

          mb={3}

        >

          Earned Value Management (EVM)

        </Typography>






        <Box

          display="grid"

          gridTemplateColumns={{

            xs:"1fr",

            sm:"repeat(2,1fr)",

            md:"repeat(3,1fr)"

          }}

          gap={3}

        >



          {items.map((item)=>(



            <Card

              key={item.title}

              variant="outlined"

              sx={{

                borderRadius:3,

              }}

            >


              <CardContent>



                <Typography

                  variant="body2"

                  color="text.secondary"

                >

                  {item.title}

                </Typography>





                <Typography

                  variant="h6"

                  fontWeight={700}

                  mt={1}

                >

                  $
                  {item.value.toLocaleString(
                    "en-US",
                    {
                      maximumFractionDigits:0
                    }
                  )}

                </Typography>



              </CardContent>


            </Card>



          ))}



        </Box>







        <Box

          mt={4}

          display="flex"

          gap={2}

          flexWrap="wrap"

        >



          <Chip

            label={
              `CPI : ${data.CPI.toFixed(2)}`
            }


            color={

              data.CPI >= 1

              ? "success"

              : "warning"

            }


          />






          <Chip

            label={
              `SPI : ${data.SPI.toFixed(2)}`
            }


            color={

              data.SPI >= 1

              ? "success"

              : "warning"

            }


          />




          <Chip

            label={
              data.CV >= 0
              ? "Under Budget"
              : "Over Budget"
            }


            color={

              data.CV >= 0

              ? "success"

              : "error"

            }


          />





          <Chip

            label={

              data.SV >= 0

              ? "Ahead Schedule"

              : "Behind Schedule"

            }


            color={

              data.SV >= 0

              ? "success"

              : "error"

            }


          />




        </Box>



      </CardContent>


    </Card>


  );


}