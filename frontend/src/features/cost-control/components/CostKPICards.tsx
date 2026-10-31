import {
  Box,
} from "@mui/material";


import {
  AttachMoneyRounded,
  AccountBalanceWalletRounded,
  TrendingUpRounded,
  TimelineRounded,
  SpeedRounded,
  AssessmentRounded,
  WarningRounded,
  PaidRounded,
} from "@mui/icons-material";


import KPICard from "../../../components/Common/KPI/KPICard";



type Props = {

  analytics: {

    totalBudget:number;

    totalActual:number;

    totalCommitment:number;

    totalForecast:number;

    totalEV:number;

    totalPV:number;

    averageSPI:number;

    averageCPI:number;

  };

};



export default function CostKPICards({

  analytics,

}:Props){



  const cards = [


    {

      title:"Budget (BAC)",

      value:`$ ${analytics.totalBudget.toLocaleString("en-US")}`,

      icon:<AttachMoneyRounded />,

      color:"#2563EB",

    },


    {

      title:"Actual Cost",

      value:`$ ${analytics.totalActual.toLocaleString("en-US")}`,

      icon:<PaidRounded />,

      color:"#DC2626",

    },


    {

      title:"Commitment",

      value:`$ ${analytics.totalCommitment.toLocaleString("en-US")}`,

      icon:<AccountBalanceWalletRounded />,

      color:"#F59E0B",

    },


    {

      title:"Forecast (EAC)",

      value:`$ ${analytics.totalForecast.toLocaleString("en-US")}`,

      icon:<TrendingUpRounded />,

      color:"#0284C7",

    },


    {

      title:"Earned Value",

      value:`$ ${analytics.totalEV.toLocaleString("en-US")}`,

      icon:<AssessmentRounded />,

      color:"#16A34A",

    },


    {

      title:"Planned Value",

      value:`$ ${analytics.totalPV.toLocaleString("en-US")}`,

      icon:<TimelineRounded />,

      color:"#9333EA",

    },


    {

      title:"SPI",

      value:analytics.averageSPI.toFixed(2),

      icon:<SpeedRounded />,

      color:
        analytics.averageSPI >= 1
          ? "#16A34A"
          : "#F59E0B",

    },


    {

      title:"CPI",

      value:analytics.averageCPI.toFixed(2),

      icon:<WarningRounded />,

      color:
        analytics.averageCPI >= 1
          ? "#16A34A"
          : "#DC2626",

    },


  ];



  return (


    <Box

      display="grid"

      gridTemplateColumns={{

        xs:"1fr",

        sm:"repeat(2,1fr)",

        md:"repeat(4,1fr)",

      }}

      gap={3}

    >



      {

        cards.map(

          (card)=>(


            <KPICard

              key={card.title}

              title={card.title}

              value={card.value}

              icon={card.icon}

              color={card.color}

              change="0%"

              subtitle="Project performance"

            />


          )

        )

      }



    </Box>


  );

}