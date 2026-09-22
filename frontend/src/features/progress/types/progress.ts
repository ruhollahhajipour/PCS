export type ProgressBasis =
    | "duration"
    | "physical"
    | "units"
    | "weighted";

export type ProgressStatus =
    | "notStarted"
    | "inProgress"
    | "completed"
    | "atRisk"
    | "delayed";

export interface ProgressPeriod {
    id: string;
    projectId: string;

    periodStart: string;
    periodEnd: string;

    dataDate: string;

    plannedProgress: number;
    actualProgress: number;

    plannedCumulative: number;
    actualCumulative: number;

    variance: number;
}

export interface ProgressEntry {
    id: string;

    projectId: string;
    activityId: string;
    wbsCode: string;

    periodId: string;

    plannedPercent: number;
    actualPercent: number;
    physicalPercent: number;

    plannedUnits?: number | null;
    actualUnits?: number | null;
    remainingUnits?: number | null;

    weightFactor?: number | null;
    weightValue?: number | null;

    actualStart?: string | null;
    actualFinish?: string | null;

    remainingDuration?: number | null;

    status: ProgressStatus;
}

export interface ProgressSummary {
    projectId: string;
    dataDate: string;

    plannedProgress: number;
    actualProgress: number;

    physicalProgress: number;
    weightedProgress: number;

    variance: number;

    activityCount: number;
    completedActivityCount: number;

    delayedActivityCount: number;
    atRiskActivityCount: number;
}

export interface ProgressWbsSummary {
    wbsCode: string;
    wbsName?: string;

    plannedProgress: number;
    actualProgress: number;

    physicalProgress: number;
    weightedProgress: number;

    variance: number;

    activityCount: number;
}

export interface ProgressCalculationInput {
    basis: ProgressBasis;

    plannedPercent?: number | null;
    actualPercent?: number | null;
    physicalPercent?: number | null;

    plannedUnits?: number | null;
    actualUnits?: number | null;
    remainingUnits?: number | null;

    weightFactor?: number | null;
}

export interface ProgressPeriodPoint {
    periodId: string;

    periodStart: string;
    periodEnd: string;

    planned: number;
    actual: number;

    plannedCumulative: number;
    actualCumulative: number;

    variance: number;
}