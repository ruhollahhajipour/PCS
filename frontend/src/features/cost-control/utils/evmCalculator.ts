import type { CostItem } from "../types/costItem";

export interface EVMResult {
  PV: number;
  EV: number;
  AC: number;

  BAC: number;

  CV: number;
  SV: number;

  CPI: number;
  SPI: number;

  EAC: number;
  ETC: number;
  VAC: number;
}

export default function evmCalculator(
  item: CostItem
): EVMResult {

  const BAC = item.budget;

  const PV =
    item.plannedValue ??
    BAC * (item.progress / 100);

  const EV =
    item.earnedValue ??
    BAC * (item.progress / 100);

  const AC = item.actual;

  const CPI =
    AC === 0
      ? 0
      : EV / AC;

  const SPI =
    PV === 0
      ? 0
      : EV / PV;

  const CV =
    EV - AC;

  const SV =
    EV - PV;

  const EAC =
    CPI === 0
      ? BAC
      : BAC / CPI;

  const ETC =
    EAC - AC;

  const VAC =
    BAC - EAC;

  return {

    PV,

    EV,

    AC,

    BAC,

    CV,

    SV,

    CPI,

    SPI,

    EAC,

    ETC,

    VAC,

  };

}