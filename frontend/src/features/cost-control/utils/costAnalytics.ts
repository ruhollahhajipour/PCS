import type { CostItem } from "../types/costItem";


export interface CostAnalytics {

  totalBudget: number;

  totalActual: number;

  totalCommitment: number;

  totalForecast: number;


  totalEV: number;

  totalPV: number;


  totalVariance: number;


  averageSPI: number;

  averageCPI: number;


  normal: number;

  warning: number;

  critical: number;

}



export default function costAnalytics(
  items: CostItem[]
): CostAnalytics {


  const totalBudget =
    items.reduce(
      (sum, x) => sum + x.budget,
      0
    );



  const totalActual =
    items.reduce(
      (sum, x) => sum + x.actual,
      0
    );



  const totalCommitment =
    items.reduce(
      (sum, x) => sum + x.commitment,
      0
    );



  const totalForecast =
    items.reduce(
      (sum, x) => sum + x.forecast,
      0
    );



  const totalEV =
    items.reduce(
      (sum, x) =>
        sum +
        (
          x.earnedValue ??
          (
            x.budget *
            x.progress /
            100
          )
        ),
      0
    );



  const totalPV =
    items.reduce(
      (sum, x) =>
        sum +
        (
          x.plannedValue ??
          (
            x.budget *
            x.progress /
            100
          )
        ),
      0
    );



  const totalVariance =
    items.reduce(
      (sum, x) =>
        sum + x.variance,
      0
    );



  const spiValues =
    items
      .map(x => x.spi)
      .filter(
        (x): x is number =>
          typeof x === "number"
      );



  const cpiValues =
    items
      .map(x => x.cpi)
      .filter(
        (x): x is number =>
          typeof x === "number"
      );



  const averageSPI =
    spiValues.length
      ? spiValues.reduce(
          (a,b)=>a+b,
          0
        )
        /
        spiValues.length
      : 0;



  const averageCPI =
    cpiValues.length
      ? cpiValues.reduce(
          (a,b)=>a+b,
          0
        )
        /
        cpiValues.length
      : 0;



  return {


    totalBudget,

    totalActual,

    totalCommitment,

    totalForecast,


    totalEV,

    totalPV,


    totalVariance,


    averageSPI,

    averageCPI,



    normal:
      items.filter(
        x=>x.status==="Normal"
      ).length,



    warning:
      items.filter(
        x=>x.status==="Warning"
      ).length,



    critical:
      items.filter(
        x=>x.status==="Critical"
      ).length,


  };

}