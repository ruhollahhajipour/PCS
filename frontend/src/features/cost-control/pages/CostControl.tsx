import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

import { useMemo } from "react";


import CostKPICards
from "../components/CostKPICards";


import BudgetChart
from "../components/BudgetChart";


import SCurveChart
from "../components/SCurveChart";


import CashFlowChart
from "../components/CashFlowChart";


import CostBreakdownChart
from "../components/CostBreakdownChart";


import WBSTree
from "../components/WBSTree";


import CriticalCostTable
from "../components/CriticalCostTable";


import useCostControl
from "../hooks/useCostControl";



export default function CostControl() {


  const {
    items,
  } = useCostControl();



  const analytics = useMemo(() => {


    const totalBudget =
      items.reduce(
        (sum, x) =>
          sum + x.budget,
        0
      );


    const totalActual =
      items.reduce(
        (sum, x) =>
          sum + x.actual,
        0
      );


    const totalCommitment =
      items.reduce(
        (sum, x) =>
          sum + x.commitment,
        0
      );


    const totalForecast =
      items.reduce(
        (sum, x) =>
          sum + x.forecast,
        0
      );


    const totalEV =
      items.reduce(
        (sum, x) =>
          sum +
          (x.earnedValue ?? 0),
        0
      );


    const totalPV =
      items.reduce(
        (sum, x) =>
          sum +
          (x.plannedValue ?? 0),
        0
      );



    const spi =
      items
        .filter(
          x =>
            typeof x.spi === "number"
        )
        .map(
          x => x.spi as number
        );


    const cpi =
      items
        .filter(
          x =>
            typeof x.cpi === "number"
        )
        .map(
          x => x.cpi as number
        );



    return {


      totalBudget,

      totalActual,

      totalCommitment,

      totalForecast,

      totalEV,

      totalPV,


      averageSPI:
        spi.length
          ? spi.reduce(
              (a,b)=>a+b,
              0
            ) / spi.length
          : 0,


      averageCPI:
        cpi.length
          ? cpi.reduce(
              (a,b)=>a+b,
              0
            ) / cpi.length
          : 0,

    };


  },[items]);




  const budgetData =
    items.map(
      x => ({

        name:x.wbs,

        budget:x.budget,

        actual:x.actual,

      })
    );




  const curveData =
    items.map(
      x => ({

        name:x.wbs,

        pv:
          x.plannedValue ?? 0,


        ev:
          x.earnedValue ?? 0,


        ac:
          x.actual,

      })
    );




  const cashFlowData =
    items.map(
      x => ({

        name:x.wbs,

        commitment:
          x.commitment,


        actual:
          x.actual,

      })
    );





  return (

    <Box>


      <Typography

        variant="h4"

        fontWeight={800}

        mb={4}

      >

        Cost Control Dashboard

      </Typography>




      <CostKPICards

        analytics={analytics}

      />





      <Grid

        container

        spacing={3}

        mt={1}

      >



        <Grid
          size={{
            xs:12
          }}
        >

          <BudgetChart

            data={budgetData}

          />

        </Grid>





        <Grid

          size={{

            xs:12,

            md:6

          }}

        >

          <SCurveChart

            data={curveData}

          />

        </Grid>





        <Grid

          size={{

            xs:12,

            md:6

          }}

        >

          <CashFlowChart

            data={cashFlowData}

          />

        </Grid>





        <Grid

          size={{

            xs:12,

            md:4

          }}

        >

          <CostBreakdownChart

            budget={
              analytics.totalBudget
            }

            actual={
              analytics.totalActual
            }

            forecast={
              analytics.totalForecast
            }

          />

        </Grid>





        <Grid

          size={{

            xs:12,

            md:4

          }}

        >

          <WBSTree/>

        </Grid>





        <Grid

          size={{

            xs:12,

            md:4

          }}

        >

          <CriticalCostTable

            rows={items}

          />

        </Grid>



      </Grid>


    </Box>

  );

}