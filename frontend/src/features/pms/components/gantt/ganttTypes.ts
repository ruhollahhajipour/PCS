import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import type { GanttRow } from "../../api/ganttApi";

export interface GanttChartProps {
    rows: GanttRow[];
    projectDuration?: number;
    activityCount?: number;
    wbsCount?: number;
    criticalCount?: number;
    milestoneCount?: number;
    statusDate?: string | null;
}

export type GanttColorPreset =
    | "theme"
    | "corporate"
    | "slate"
    | "engineering"
    | "p6"
    | "highContrast"
    | "custom";

export type TimelineScale =
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";

export type ProgressCalculationType =
    | "duration"
    | "physical"
    | "units"
    | "weighted";

/**
 * Display/formula result formats used by user-defined Gantt columns.
 * The formula language is intentionally Excel-like and is evaluated later
 * by the dedicated formula engine.
 */
export type GanttFormulaFormat =
    | "general"
    | "number"
    | "integer"
    | "percent"
    | "date"
    | "text"
    | "boolean";

export type GanttFormulaAlignment =
    | "left"
    | "center"
    | "right";

export interface GanttFormulaColumnDefinition {
    id: string;
    key: string;
    label: string;
    formula: string;
    width: number;
    format: GanttFormulaFormat;
    decimals?: number;
    align?: GanttFormulaAlignment;
    visible?: boolean;
    mandatory?: boolean;
}

export interface GanttFormulaColumnStyle {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    fontItalic?: boolean;
    fontColor?: string;
    verticalAlignment?: "top" | "center" | "bottom";
}

export interface GanttGridSettings {
    showVerticalGrid: boolean;
    showHorizontalGrid: boolean;
    showMajorGrid: boolean;
    showMinorGrid: boolean;
    showWeekends: boolean;
    showTodayLine: boolean;
    showDataDateLine: boolean;
}

export interface GanttTimescaleSettings {
    primaryScale: TimelineScale;
    secondaryScale: TimelineScale | "none";
    dayWidth: number;
    showWeekNumbers: boolean;
    showYear: boolean;
    compactHeaders: boolean;
    primaryDateFormat: string;
    secondaryDateFormat: string;
}

export interface GanttBarSettings {
    showBars: boolean;
    showProgress: boolean;
    showActual: boolean;
    showLabels: boolean;
    showRelationships: boolean;
    barHeight: number;
    progressHeight: number;
    labelPosition: "inside" | "right" | "left" | "top";
}

export interface GanttAppearanceSettings {
    rowHeight: number;
    fontFamily: string;
    fontSize: number;
    headerFontSize: number;
    borderRadius: number;
    compactToolbar: boolean;
    alternateRowFill: boolean;
}

export interface GanttSettings {
    timescale: GanttTimescaleSettings;
    grid: GanttGridSettings;
    bars: GanttBarSettings;
    appearance: GanttAppearanceSettings;
}

export interface GanttCustomColors {
    wbsLevel1: string;
    wbsLevel2: string;
    wbsLevel3: string;
    wbsLevel4: string;
    wbsLevel5: string;
    wbsLevel6: string;
    wbsLevel7: string;
    wbsLevel8: string;
    wbsLevel9: string;
    wbsLevel10: string;
    wbsLevel11: string;
    wbsLevel12: string;
    wbsLevel13: string;
    wbsLevel14: string;
    wbsLevel15: string;
    wbsLevel16: string;
    wbsLevel17: string;
    wbsLevel18: string;
    wbsLevel19: string;
    wbsLevel20: string;

    activity: string;
    critical: string;
    milestone: string;
}

export interface GanttColorSettings {
    preset: GanttColorPreset;
    custom: GanttCustomColors;
}

export interface GanttPalette {
    paper: string;
    surface: string;
    background: string;
    header: string;
    subHeader: string;
    border: string;
    grid: string;
    gridLight: string;
    text: string;
    muted: string;
    primary: string;
    secondary: string;

    activityBackground: string;
    activityBorder: string;
    activityProgress: string;

    criticalBackground: string;
    criticalBorder: string;
    criticalProgress: string;

    wbsBackground: string;
    wbsBorder: string;
    wbsProgress: string;

    milestone: string;
    milestoneCritical: string;
    float: string;

    selected: string;
    selectedBorder: string;
    hover: string;
    zebra: string;

    success: string;
    warning: string;
    error: string;
}

export interface ScheduleRange {
    start: Date;
    end: Date;
    hasRealDates: boolean;
}

export interface TimelineUnit {
    start: Date;
    end: Date;
    label: string;
    secondaryLabel?: string;
}

export interface RowSchedule {
    start: Date | null;
    finish: Date | null;
    actualStart: Date | null;
    actualFinish: Date | null;
    hasRealDates: boolean;
}

export type PmsColumnKey =
    | "code"
    | "activity"
    | "start"
    | "finish"
    | "duration"
    | "wf"
    | "wv"
    | "plannedProgress"
    | "actualProgress"
    | "remaining"
    | "totalFloat"
    | "freeFloat"
    | "status"

    // Relationships
    | "relationships"
    | "predecessors"
    | "successors"

    // Actual / schedule dates
    | "actualStart"
    | "actualFinish"

    // Constraints
    | "constraint"
    | "constraintDate"

    // CPM
    | "earlyStart"
    | "earlyFinish"
    | "lateStart"
    | "lateFinish"
    | "drivingFloat"
    | "critical";

export interface PmsColumnDefinition {
    key: PmsColumnKey;
    label: string;
    width: number;
    mandatory?: boolean;
    align?: "left" | "center" | "right";
}

export interface PmsColumnStyle {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    fontItalic: boolean;
    fontColor: string;
    verticalAlignment: "top" | "center" | "bottom";
}

export type PmsGanttRow = GanttRow & {
    weightFactor?: number | null;
    weightValue?: number | null;
    weightedProgress?: number | null;

    plannedProgress?: number | null;
    actualProgress?: number | null;

    plannedValue?: number | null;
    earnedValue?: number | null;
    actualCost?: number | null;

    actualUnits?: number | null;
    completedUnits?: number | null;
    totalUnits?: number | null;

    actualQuantity?: number | null;
    completedQuantity?: number | null;
    totalQuantity?: number | null;

    unitsComplete?: number | null;
    unitsTotal?: number | null;

    actualDuration?: number | null;

    /** User-defined calculated column values, keyed by formula column id. */
    formulaValues?: Record<string, unknown>;
};

export interface PmsSimpleCells {
    start?: ReactNode;
    finish?: ReactNode;
    duration?: ReactNode;
    wf?: ReactNode;
    wv?: ReactNode;
    remaining?: ReactNode;
    totalFloat?: ReactNode;
    freeFloat?: ReactNode;
}

export type GanttTheme = Theme;
