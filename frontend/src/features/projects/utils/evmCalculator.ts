import type { Project } from "../../../models/project";


export type EVMResult = {

  PV:number;

  EV:number;

  AC:number;

  CV:number;

  SV:number;

  CPI:number;

  SPI:number;

};





export default function evmCalculator(
  project:Project
):EVMResult {



  const budget =
    Number(project.budget ?? 0);



  const actualCost =
    Number(project.actualCost ?? 0);



  const progress =
    Number(project.progress ?? 0);





  const plannedProgress =
    progress / 100;





  const PV =
    budget * plannedProgress;



  const EV =
    budget * plannedProgress;



  const AC =
    actualCost;





  const CV =
    EV - AC;



  const SV =
    EV - PV;





  const CPI =
    AC === 0

      ? 0

      : EV / AC;





  const SPI =
    PV === 0

      ? 0

      : EV / PV;







  return {

    PV,

    EV,

    AC,

    CV,

    SV,

    CPI,

    SPI,

  };


}