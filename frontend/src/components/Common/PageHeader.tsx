import {
  Box,
  Typography,
  Breadcrumbs,
} from "@mui/material";


import HomeRoundedIcon
from "@mui/icons-material/HomeRounded";


type Props = {

  title:string;

  subtitle:string;

  action?:React.ReactNode;

};





export default function PageHeader({

  title,

  subtitle,

  action,

}:Props){


  return (


    <Box sx={{ mb:4 }}>


      <Breadcrumbs sx={{ mb:1 }}>


        <HomeRoundedIcon

          sx={{

            fontSize:18,

          }}

        />



        <Typography color="#2563EB">

          {title}

        </Typography>



      </Breadcrumbs>





      <Box

        display="flex"

        justifyContent="space-between"

        alignItems="center"

      >


        <Box>



          <Typography

            sx={{

              fontSize:40,

              fontWeight:800,

              color:"#16355B",

            }}

          >

            {title}


          </Typography>





          <Typography

            sx={{

              mt:1,

              color:"#64748B",

              fontSize:17,

            }}

          >

            {subtitle}


          </Typography>


        </Box>





        <Box>

          {action}

        </Box>



      </Box>


    </Box>


  );


}