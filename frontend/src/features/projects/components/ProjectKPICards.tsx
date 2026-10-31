import {
  Grid,
} from "@mui/material";


import KPICard
from "../../../components/Common/KPI/KPICard";


import AccountBalanceWalletRoundedIcon
from "@mui/icons-material/AccountBalanceWalletRounded";


import PaymentsRoundedIcon
from "@mui/icons-material/PaymentsRounded";


import TrendingUpRoundedIcon
from "@mui/icons-material/TrendingUpRounded";


import BusinessCenterRoundedIcon
from "@mui/icons-material/BusinessCenterRounded";




type Props = {

  totalBudget:number;

  actualCost:number;

  progress:number;

  activeProjects:number;

};







export default function ProjectKPICards({

  totalBudget,

  actualCost,

  progress,

  activeProjects,

}:Props){





  const items = [


    {

      title:"Total Budget",

      value:
        `$ ${totalBudget.toLocaleString("en-US")}`,

      icon:
        <AccountBalanceWalletRoundedIcon />,

      color:
        "primary",

    },



    {

      title:"Actual Cost",

      value:
        `$ ${actualCost.toLocaleString("en-US")}`,

      icon:
        <PaymentsRoundedIcon />,

      color:
        "warning",

    },



    {

      title:"Average Progress",

      value:
        `${progress.toFixed(1)}%`,

      icon:
        <TrendingUpRoundedIcon />,

      color:
        "success",

    },



    {

      title:"Active Projects",

      value:
        activeProjects,

      icon:
        <BusinessCenterRoundedIcon />,

      color:
        "info",

    },


  ];







  return (


    <Grid

      container

      spacing={3}

    >


      {
        items.map(
          item => (


            <Grid

              key={item.title}

              size={{
                xs:12,
                sm:6,
                md:3
              }}

            >


              <KPICard


                title={item.title}


                value={item.value}


                icon={item.icon}


              />


            </Grid>


          )

        )
      }



    </Grid>


  );


}