import { Box, Typography } from "@mui/material";

import { useEffect, useState } from "react";

import CostKPICards
from "../components/CostKPICards";

import BudgetChart
from "../components/BudgetChart";

import SCurveChart
from "../components/SCurveChart";

import CashFlowChart
from "../components/CashFlowChart";

import CriticalCostTable
from "../components/CriticalCostTable";

import costAnalytics
from "../utils/costAnalytics";

import costService
from "../services/cost.service";

import type { CostItem }
from "../types/costItem";

export default function CostDashboard() {

  const [items, setItems] =
    useState<CostItem[]>([]);

  useEffect(() => {

    async function load() {

      const data =
        await costService.getAll();

      setItems(data);

    }

    load();

  }, []);

  const analytics =
    costAnalytics(items);

  return (

    <Box p={3}>

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

  <Box mt={4}>

    <BudgetChart

      data={items.map(x=>({

        name:x.wbs,

        budget:x.budget,

        actual:x.actual,

      }))}

    />

  </Box>

  <Box

    mt={4}

    display="grid"

    gridTemplateColumns={{

      xs:"1fr",

      md:"repeat(2,1fr)",

    }}

    gap={3}

  >

    <SCurveChart

      data={items.map(x=>({

        name:x.wbs,

        pv:x.plannedValue ?? 0,

        ev:x.earnedValue ?? 0,

        ac:x.actual,

      }))}

    />

    <CashFlowChart

      data={items.map(x=>({

        name:x.wbs,

        commitment:x.commitment,

        actual:x.actual,

      }))}

    />

  </Box>

  <Box mt={4}>

    <CriticalCostTable
      rows={items}
    />

  </Box>

</Box>

  );

}