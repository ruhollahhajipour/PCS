export type EVMResult = {
  PV: number;
  EV: number;
  AC: number;
  CV: number;
  SV: number;
  CPI: number;
  SPI: number;
};

export type EVMCalculationInput = {
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
};

/**
 * Calculates EVM indices from values already derived from an approved baseline.
 * This helper intentionally does not infer PV from current progress.
 */
export default function evmCalculator(
  input: EVMCalculationInput
): EVMResult {
  const PV = Math.max(0, Number(input.plannedValue) || 0);
  const EV = Math.max(0, Number(input.earnedValue) || 0);
  const AC = Math.max(0, Number(input.actualCost) || 0);

  return {
    PV,
    EV,
    AC,
    CV: EV - AC,
    SV: EV - PV,
    CPI: AC === 0 ? 0 : EV / AC,
    SPI: PV === 0 ? 0 : EV / PV,
  };
}
