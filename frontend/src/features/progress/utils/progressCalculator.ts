import type {
    ProgressBasis,
    ProgressCalculationInput,
    ProgressEntry,
    ProgressPeriod,
    ProgressPeriodPoint,
    ProgressSummary
} from "../types/progress";

/* =========================================================
 * CONSTANTS
 * ========================================================= */

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

/* =========================================================
 * HELPERS
 * ========================================================= */

function clampProgress(
    value: number | null | undefined
): number {
    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(value)
    ) {
        return 0;
    }

    return Math.max(
        MIN_PROGRESS,
        Math.min(
            MAX_PROGRESS,
            value
        )
    );
}

function safeNumber(
    value: number | null | undefined
): number {
    return value !== null &&
        value !== undefined &&
        Number.isFinite(value)
        ? value
        : 0;
}

/* =========================================================
 * BASIS CALCULATION
 * ========================================================= */

export function calculateActivityProgress(
    input: ProgressCalculationInput
): number {
    switch (input.basis) {
        case "duration":
            return clampProgress(
                input.actualPercent
            );

        case "physical":
            return clampProgress(
                input.physicalPercent ??
                    input.actualPercent
            );

        case "units": {
            const plannedUnits =
                safeNumber(
                    input.plannedUnits
                );

            const actualUnits =
                safeNumber(
                    input.actualUnits
                );

            if (plannedUnits <= 0) {
                return clampProgress(
                    input.actualPercent
                );
            }

            return clampProgress(
                (actualUnits /
                    plannedUnits) *
                    100
            );
        }

        case "weighted":
            return clampProgress(
                input.actualPercent
            );

        default:
            return clampProgress(
                input.actualPercent
            );
    }
}

/* =========================================================
 * VARIANCE
 * ========================================================= */

export function calculateProgressVariance(
    planned: number,
    actual: number
): number {
    return (
        clampProgress(actual) -
        clampProgress(planned)
    );
}

/* =========================================================
 * WEIGHTED PROGRESS
 * ========================================================= */

export function calculateWeightedProgress(
    entries: ProgressEntry[]
): number {
    if (!entries.length) {
        return 0;
    }

    let weightedValue = 0;
    let totalWeight = 0;

    for (const entry of entries) {
        const weight =
            safeNumber(
                entry.weightFactor ??
                    entry.weightValue
            );

        const progress =
            clampProgress(
                entry.actualPercent
            );

        if (weight <= 0) {
            continue;
        }

        totalWeight += weight;

        weightedValue +=
            weight *
            progress;
    }

    if (totalWeight <= 0) {
        return 0;
    }

    return clampProgress(
        weightedValue /
            totalWeight
    );
}

/* =========================================================
 * PHYSICAL PROGRESS
 * ========================================================= */

export function calculatePhysicalProgress(
    entries: ProgressEntry[]
): number {
    if (!entries.length) {
        return 0;
    }

    let total = 0;
    let count = 0;

    for (const entry of entries) {
        total += clampProgress(
            entry.physicalPercent
        );

        count++;
    }

    if (count === 0) {
        return 0;
    }

    return clampProgress(
        total / count
    );
}

/* =========================================================
 * SIMPLE ACTUAL PROGRESS
 * ========================================================= */

export function calculateAverageActualProgress(
    entries: ProgressEntry[]
): number {
    if (!entries.length) {
        return 0;
    }

    const total =
        entries.reduce(
            (sum, entry) =>
                sum +
                clampProgress(
                    entry.actualPercent
                ),
            0
        );

    return clampProgress(
        total / entries.length
    );
}

/* =========================================================
 * SUMMARY
 * ========================================================= */

export function calculateProgressSummary(
    projectId: string,
    dataDate: string,
    entries: ProgressEntry[],
    plannedProgress: number
): ProgressSummary {
    const actualProgress =
        calculateAverageActualProgress(
            entries
        );

    const physicalProgress =
        calculatePhysicalProgress(
            entries
        );

    const weightedProgress =
        calculateWeightedProgress(
            entries
        );

    const completedActivityCount =
        entries.filter(
            entry =>
                clampProgress(
                    entry.actualPercent
                ) >= 100
        ).length;

    const delayedActivityCount =
        entries.filter(
            entry =>
                entry.status ===
                "delayed"
        ).length;

    const atRiskActivityCount =
        entries.filter(
            entry =>
                entry.status ===
                "atRisk"
        ).length;

    return {
        projectId,
        dataDate,

        plannedProgress:
            clampProgress(
                plannedProgress
            ),

        actualProgress,

        physicalProgress,

        weightedProgress,

        variance:
            calculateProgressVariance(
                plannedProgress,
                actualProgress
            ),

        activityCount:
            entries.length,

        completedActivityCount,

        delayedActivityCount,

        atRiskActivityCount
    };
}

/* =========================================================
 * PERIODIZED CURVE
 * ========================================================= */

export function buildProgressCurve(
    periods: ProgressPeriod[]
): ProgressPeriodPoint[] {
    const sorted =
        [...periods].sort(
            (a, b) =>
                a.periodStart.localeCompare(
                    b.periodStart
                )
        );

    let plannedCumulative = 0;
    let actualCumulative = 0;

    return sorted.map(
        period => {
            plannedCumulative +=
                safeNumber(
                    period.plannedProgress
                );

            actualCumulative +=
                safeNumber(
                    period.actualProgress
                );

            plannedCumulative =
                clampProgress(
                    plannedCumulative
                );

            actualCumulative =
                clampProgress(
                    actualCumulative
                );

            return {
                periodId:
                    period.id,

                periodStart:
                    period.periodStart,

                periodEnd:
                    period.periodEnd,

                planned:
                    clampProgress(
                        period.plannedProgress
                    ),

                actual:
                    clampProgress(
                        period.actualProgress
                    ),

                plannedCumulative,

                actualCumulative,

                variance:
                    calculateProgressVariance(
                        plannedCumulative,
                        actualCumulative
                    )
            };
        }
    );
}

/* =========================================================
 * BASIS DISPATCH
 * ========================================================= */

export function calculateProgressByBasis(
    entries: ProgressEntry[],
    basis: ProgressBasis
): number {
    switch (basis) {
        case "weighted":
            return calculateWeightedProgress(
                entries
            );

        case "physical":
            return calculatePhysicalProgress(
                entries
            );

        case "duration":
        case "units":
        default:
            return calculateAverageActualProgress(
                entries
            );
    }
}