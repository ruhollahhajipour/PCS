import type { GanttRow as ApiGanttRow } from "../../../api/ganttApi";

export type GanttSummaryRow = ApiGanttRow & {
    weightFactor?: number | null;
    weightValue?: number | null;
    weightedProgress?: number | null;
    plannedValue?: number | null;
    actualProgress?: number | null;
    budget?: number | null;
    actualCost?: number | null;
    earnedValue?: number | null;
    cpi?: number | null;
    spi?: number | null;
};

const PROJECT_ROW_ID = "__project_level_0__";
const DAY_MS = 86_400_000;
const EPOCH_DATE_THRESHOLD = 100_000_000_000;

function finite(value: unknown, fallback = 0): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function finiteOrNull(value: unknown): number | null {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Only epoch-like numeric values are valid calendar timestamps here.
 * Relative CPM values such as 0, 1, 2 must never be interpreted as dates.
 */
function parseScheduleDate(value: unknown): Date | null {
    if (value instanceof Date) {
        const time = value.getTime();
        return Number.isFinite(time) ? new Date(time) : null;
    }

    if (typeof value === "number") {
        if (!Number.isFinite(value) || value < EPOCH_DATE_THRESHOLD) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    if (typeof value !== "string" || value.trim().length === 0) return null;

    const trimmed = value.trim();
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) {
        if (numeric < EPOCH_DATE_THRESHOLD) return null;
        const date = new Date(numeric);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toLocalMidnight(date: Date | null): Date | null {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalMidnightIso(date: Date | null): string | null {
    const normalized = toLocalMidnight(date);
    if (!normalized) return null;

    const year = normalized.getFullYear();
    const month = String(normalized.getMonth() + 1).padStart(2, "0");
    const day = String(normalized.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T00:00:00`;
}

/**
 * PCS display duration rule:
 * Finish - Start + 1 calendar day.
 *
 * This is deliberately separate from working-duration values used by the
 * scheduler/CPM engine.
 */
function inclusiveDuration(start: Date | null, finish: Date | null): number {
    const normalizedStart = toLocalMidnight(start);
    const normalizedFinish = toLocalMidnight(finish);

    if (!normalizedStart || !normalizedFinish) return 0;

    return Math.max(
        1,
        Math.floor((normalizedFinish.getTime() - normalizedStart.getTime()) / DAY_MS) + 1
    );
}

function getStart(row: ApiGanttRow): Date | null {
    return parseScheduleDate(row.start)
        ?? parseScheduleDate(row.plannedStart)
        ?? parseScheduleDate(row.actualStart);
}

function getFinish(row: ApiGanttRow): Date | null {
    return parseScheduleDate(row.finish)
        ?? parseScheduleDate(row.plannedFinish)
        ?? parseScheduleDate(row.actualFinish);
}

function flattenActivities(
    rows: ApiGanttRow[],
    output: ApiGanttRow[] = []
): ApiGanttRow[] {
    for (const row of rows) {
        if (row.type === "activity") {
            output.push(row);
        }

        if (row.children?.length) {
            flattenActivities(row.children, output);
        }
    }

    return output;
}

function flattenAll(
    rows: ApiGanttRow[],
    output: ApiGanttRow[] = []
): ApiGanttRow[] {
    for (const row of rows) {
        output.push(row);

        if (row.children?.length) {
            flattenAll(row.children, output);
        }
    }

    return output;
}

function aggregateRows(rows: ApiGanttRow[]) {
    const activities = flattenActivities(rows);
    const sourceRows = activities.length > 0 ? activities : flattenAll(rows);

    const starts = sourceRows
        .map(getStart)
        .filter((value): value is Date => value !== null);

    const finishes = sourceRows
        .map(getFinish)
        .filter((value): value is Date => value !== null);

    const start = starts.length > 0
        ? new Date(Math.min(...starts.map(value => value.getTime())))
        : null;

    const finish = finishes.length > 0
        ? new Date(Math.max(...finishes.map(value => value.getTime())))
        : null;

    const budget = sourceRows.reduce(
        (sum, row) => sum + finite((row as GanttSummaryRow).budget),
        0
    );

    const actualCost = sourceRows.reduce(
        (sum, row) => sum + finite((row as GanttSummaryRow).actualCost),
        0
    );

    const earnedValue = sourceRows.reduce(
        (sum, row) => sum + finite((row as GanttSummaryRow).earnedValue),
        0
    );

    const plannedValue = sourceRows.reduce(
        (sum, row) => sum + finite((row as GanttSummaryRow).plannedValue),
        0
    );

    const progress = budget > 0
        ? clamp((earnedValue / budget) * 100, 0, 100)
        : activities.length > 0
            ? clamp(
                activities.reduce(
                    (sum, row) => sum + finite((row as GanttSummaryRow).progress),
                    0
                ) / activities.length,
                0,
                100
            )
            : 0;

    const duration = inclusiveDuration(start, finish);

    const totalFloatValues = sourceRows
        .map(row => finiteOrNull(row.totalFloat ?? row.float))
        .filter((value): value is number => value !== null);

    const freeFloatValues = sourceRows
        .map(row => finiteOrNull(row.freeFloat))
        .filter((value): value is number => value !== null);

    const drivingFloatValues = sourceRows
        .map(row => finiteOrNull(row.drivingFloat))
        .filter((value): value is number => value !== null);

    const totalFloat = totalFloatValues.length > 0
        ? Math.min(...totalFloatValues)
        : 0;

    const freeFloat = freeFloatValues.length > 0
        ? Math.min(...freeFloatValues)
        : 0;

    const drivingFloat = drivingFloatValues.length > 0
        ? Math.min(...drivingFloatValues)
        : 0;

    const critical =
        sourceRows.some(row => row.isCritical) ||
        (totalFloat <= 0 && sourceRows.length > 0);

    const milestones = sourceRows.filter(row => row.isMilestone).length;

    const completed =
        sourceRows.length > 0 &&
        sourceRows.every(row => finite((row as GanttSummaryRow).progress) >= 100);

    const cpi = actualCost > 0 ? earnedValue / actualCost : null;
    const spi = plannedValue > 0 ? earnedValue / plannedValue : null;

    return {
        start,
        finish,
        duration,
        budget,
        actualCost,
        earnedValue,
        plannedValue,
        progress,
        totalFloat,
        freeFloat,
        drivingFloat,
        critical,
        milestones,
        completed,
        cpi,
        spi,
        sourceCount: sourceRows.length
    };
}

function buildWbsSummary(
    row: ApiGanttRow,
    parentBudget: number | null
): GanttSummaryRow {
    const sourceRow = row as GanttSummaryRow;
    const existingBudget = finiteOrNull(sourceRow.budget);

    const children = (row.children ?? []).map(child =>
        child.type === "wbs"
            ? buildWbsSummary(child, existingBudget)
            : { ...child }
    );

    const summary = aggregateRows(children.length > 0 ? children : [row]);

    const budget = existingBudget !== null && existingBudget > 0
        ? existingBudget
        : summary.budget;

    const weightFactor = parentBudget !== null && parentBudget > 0
        ? clamp((budget / parentBudget) * 100, 0, 100)
        : finiteOrNull(sourceRow.weightFactor) ?? 100;

    const weightValue = finiteOrNull(sourceRow.weightValue) ?? budget;

    const rolledStart = summary.start;
    const rolledFinish = summary.finish;
    const rolledDuration = inclusiveDuration(rolledStart, rolledFinish);

    const calculatedProgress = summary.progress;

    return {
        ...row,
        level: Math.max(1, finite(row.level)),

        // P6-style WBS roll-up: summary dates come exclusively from descendants.
        // The API contract requires numeric Start/Finish, therefore 0 means no date.
        start: rolledStart?.getTime() ?? 0,
        finish: rolledFinish?.getTime() ?? 0,
        duration: rolledDuration,

        plannedStart:
            toLocalMidnightIso(rolledStart) ??
            row.plannedStart ??
            null,

        plannedFinish:
            toLocalMidnightIso(rolledFinish) ??
            row.plannedFinish ??
            null,

        remainingDuration: Math.max(
            0,
            rolledDuration * (1 - calculatedProgress / 100)
        ),

        progress: calculatedProgress,
        actualProgress: calculatedProgress,
        weightedProgress: calculatedProgress,

        budget,
        actualCost: summary.actualCost > 0
            ? summary.actualCost
            : finite(sourceRow.actualCost),
        earnedValue: summary.earnedValue > 0
            ? summary.earnedValue
            : finite(sourceRow.earnedValue),
        plannedValue: summary.plannedValue,

        totalFloat: summary.totalFloat,
        freeFloat: summary.freeFloat,
        drivingFloat: summary.drivingFloat,
        float: summary.totalFloat,

        isCritical: summary.critical,
        status: summary.completed
            ? "Completed"
            : calculatedProgress > 0
                ? "InProgress"
                : row.status ?? "NotStarted",

        weightFactor,
        weightValue,
        cpi: summary.cpi,
        spi: summary.spi,

        children
    };
}

export function buildGanttSummaryRows(
    rows: ApiGanttRow[],
    projectDuration?: number | null,
    projectName?: string | null
): ApiGanttRow[] {
    // projectDuration is intentionally not used to manufacture a project span.
    // The Project row must be calculated from its descendant activity dates.
    void projectDuration;

    const sourceRows = rows.map(row =>
        row.type === "wbs"
            ? buildWbsSummary(row, null)
            : { ...row }
    );

    const aggregate = aggregateRows(sourceRows);
    const projectProgress = aggregate.progress;
    const projectDurationDays = inclusiveDuration(aggregate.start, aggregate.finish);

    const projectRow: GanttSummaryRow = {
        id: PROJECT_ROW_ID,
        type: "wbs",
        parentId: null,
        code: "0",
        name: projectName?.trim() || "Project Summary",
        level: 0,

        // Project Start/Finish are the min/max of all descendant activities.
        start: aggregate.start?.getTime() ?? 0,
        finish: aggregate.finish?.getTime() ?? 0,
        duration: projectDurationDays,

        plannedStart: toLocalMidnightIso(aggregate.start),
        plannedFinish: toLocalMidnightIso(aggregate.finish),
        actualStart: null,
        actualFinish: null,

        remainingDuration: Math.max(
            0,
            projectDurationDays * (1 - projectProgress / 100)
        ),

        constraintType: "ASAP",
        constraintDate: null,

        progress: projectProgress,
        actualProgress: projectProgress,
        weightedProgress: projectProgress,

        budget: aggregate.budget,
        actualCost: aggregate.actualCost,
        earnedValue: aggregate.earnedValue,
        plannedValue: aggregate.plannedValue,

        totalFloat: aggregate.totalFloat,
        freeFloat: aggregate.freeFloat,
        drivingFloat: aggregate.drivingFloat,
        float: aggregate.totalFloat,

        isCritical: aggregate.critical,
        isMilestone: false,

        status: aggregate.completed
            ? "Completed"
            : projectProgress > 0
                ? "InProgress"
                : "NotStarted",

        weightFactor: 100,
        weightValue: 100,

        cpi: aggregate.cpi,
        spi: aggregate.spi,

        predecessors: [],
        successors: [],
        children: sourceRows
    };

    return [projectRow];
}
