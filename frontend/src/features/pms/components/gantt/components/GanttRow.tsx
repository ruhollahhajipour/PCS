import {
    Box,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";

import {
    Check,
    Close,
    EditOutlined,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";

import { alpha } from "@mui/material/styles";
import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import type { GanttRow as ApiGanttRow } from "../../../api/ganttApi";
import type {
    GanttCustomColors,
    GanttPalette,
    PmsColumnKey,
    ProgressCalculationType
} from "../ganttTypes";
import { formatNumericValue, formatProgress, getRowSchedule, parseDate } from "../ganttUtils";

export type GanttPmsDateFormat =
    | "YYYY-MM-DD"
    | "DD/MM/YYYY"
    | "MM/DD/YYYY"
    | "DD-MMM-YYYY";

type HorizontalAlignment = "left" | "center" | "right";
type VerticalAlignment = "top" | "center" | "bottom";

export type GanttProgressCalculation = "duration" | "physical" | "units" | "weighted";
export type GanttPercentCompleteType = "Duration" | "Physical" | "Units" | "Weighted";
export type GanttSchedulingMode = "CPM" | "Manual";

export interface PmsColumnStyle {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    fontItalic: boolean;
    fontColor: string;
    verticalAlignment: VerticalAlignment;
}

interface GanttColumnsLike {
    visibleColumns: Array<{
        key: PmsColumnKey;
        label: string;
        width: number;
        mandatory?: boolean;
        align?: HorizontalAlignment;
    }>;
    columnWidths?: Partial<Record<PmsColumnKey, number>>;
    columnAlignments?: Partial<Record<PmsColumnKey, HorizontalAlignment>>;
    columnStyles?: Partial<Record<PmsColumnKey, PmsColumnStyle>>;
}

type PmsCalculationRow = ApiGanttRow & {
    weightFactor?: number | null;
    weightValue?: number | null;
    plannedProgress?: number | null;
    plannedValue?: number | null;
    earnedValue?: number | null;
    actualProgress?: number | null;
    percentComplete?: number | null;
    actualUnits?: number | null;
    completedUnits?: number | null;
    totalUnits?: number | null;
    actualQuantity?: number | null;
    completedQuantity?: number | null;
    totalQuantity?: number | null;
    unitsComplete?: number | null;
    unitsTotal?: number | null;
    actualDuration?: number | null;
};

export interface GanttRowProps {
    row: ApiGanttRow;
    index: number;
    side: "pms" | "timeline";
    colors: GanttPalette;
    columns: GanttColumnsLike;
    rowHeight: number;
    selected: boolean;
    onSelect: (rowId: string) => void;
    onUpdate?: (rowId: string, patch: Partial<ApiGanttRow>) => void;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    fontItalic?: boolean;
    fontColor?: string;
    verticalAlignment?: VerticalAlignment;
    dateFormat?: GanttPmsDateFormat;
    expandedIds: Set<string>;
    toggleRow: (rowId: string) => void;
    timelineWidth?: number;
    dateToX?: (date: Date) => number;
    widthBetweenDates?: (start: Date, end: Date) => number;
    timelineGridStep?: number;
    barStyle?: string;
    customColors?: GanttCustomColors;
    getWbsColor?: (level: number) => string;
    statusDate?: Date | null;
    statusDateVisible?: boolean;
    progressCalculation?: ProgressCalculationType;
    percentCompleteType?: GanttPercentCompleteType;
    schedulingMode?: GanttSchedulingMode;
    showDataDate?: boolean;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

function toFiniteNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
}

function normalizeColumnStyle(
    style: Partial<PmsColumnStyle> | undefined,
    fallback: PmsColumnStyle
): PmsColumnStyle {
    return {
        fontFamily: style?.fontFamily ?? fallback.fontFamily,
        fontSize: Number.isFinite(style?.fontSize) ? clamp(Number(style?.fontSize), 8, 24) : fallback.fontSize,
        fontWeight: Number.isFinite(style?.fontWeight) ? clamp(Number(style?.fontWeight), 300, 900) : fallback.fontWeight,
        fontItalic: style?.fontItalic ?? fallback.fontItalic,
        fontColor: style?.fontColor ?? fallback.fontColor,
        verticalAlignment: style?.verticalAlignment ?? fallback.verticalAlignment
    };
}

function getFlexVerticalAlignment(alignment: VerticalAlignment): "flex-start" | "center" | "flex-end" {
    return alignment === "top" ? "flex-start" : alignment === "bottom" ? "flex-end" : "center";
}

function normalizeProgressValue(value: unknown): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const normalized = numeric > 0 && numeric <= 1 ? numeric * 100 : numeric;
    return clamp(normalized, 0, 100);
}

function getPhysicalProgress(row: ApiGanttRow): number {
    const r = row as PmsCalculationRow;
    if (isFiniteNumber(r.actualProgress)) return normalizeProgressValue(r.actualProgress);
    if (isFiniteNumber(r.percentComplete)) return normalizeProgressValue(r.percentComplete);
    return normalizeProgressValue(row.progress);
}

function getActualProgress(
    row: ApiGanttRow,
    percentCompleteType: GanttPercentCompleteType = "Physical",
    statusDate?: Date | null
): number {
    switch (percentCompleteType) {
        case "Duration":
            return calculateDurationProgress(row, statusDate) ?? getPhysicalProgress(row);
        case "Units":
            return calculateUnitsProgress(row) ?? getPhysicalProgress(row);
        case "Weighted":
            return calculateWeightedProgress(row) ?? getPhysicalProgress(row);
        case "Physical":
        default:
            return getPhysicalProgress(row);
    }
}

function calculatePlannedProgress(row: ApiGanttRow, statusDate?: Date | null): number | null {
    const stored = toFiniteNumber((row as PmsCalculationRow).plannedProgress);
    if (stored !== null) return normalizeProgressValue(stored);
    if (!statusDate) return null;
    const start = parseDate(row.plannedStart)?.getTime();
    const finish = parseDate(row.plannedFinish)?.getTime();
    const dataDate = statusDate.getTime();
    if (!Number.isFinite(start) || !Number.isFinite(finish) || !Number.isFinite(dataDate)) return null;
    if (finish! <= start!) return dataDate >= finish! ? 100 : 0;
    if (dataDate <= start!) return 0;
    if (dataDate >= finish!) return 100;
    return clamp(((dataDate - start!) / (finish! - start!)) * 100, 0, 100);
}

function calculateDurationProgress(row: ApiGanttRow, statusDate?: Date | null): number | null {
    const r = row as PmsCalculationRow;
    const duration = toFiniteNumber(row.duration);
    if (duration !== null && duration > 0) {
        const actualDuration = toFiniteNumber(r.actualDuration);
        if (actualDuration !== null) return clamp((actualDuration / duration) * 100, 0, 100);
        const remaining = toFiniteNumber(row.remainingDuration);
        if (remaining !== null) return clamp((1 - remaining / duration) * 100, 0, 100);
    }
    if (statusDate && duration !== null && duration > 0) {
        const start = parseDate(row.actualStart) ?? parseDate(row.plannedStart);
        if (start) {
            const elapsedDays = (statusDate.getTime() - start.getTime()) / 86400000;
            if (Number.isFinite(elapsedDays)) return clamp((elapsedDays / duration) * 100, 0, 100);
        }
    }
    return null;
}

function calculateUnitsProgress(row: ApiGanttRow): number | null {
    const r = row as PmsCalculationRow;
    const completed =
        toFiniteNumber(r.completedUnits) ??
        toFiniteNumber(r.completedQuantity) ??
        toFiniteNumber(r.unitsComplete) ??
        toFiniteNumber(r.actualUnits) ??
        toFiniteNumber(r.actualQuantity);
    const total =
        toFiniteNumber(r.totalUnits) ??
        toFiniteNumber(r.totalQuantity) ??
        toFiniteNumber(r.unitsTotal);
    if (completed === null || total === null || total <= 0) return null;
    return clamp((completed / total) * 100, 0, 100);
}

function calculateWeightedProgress(row: ApiGanttRow): number | null {
    const r = row as PmsCalculationRow;
    const wf = isFiniteNumber(r.weightFactor) ? r.weightFactor : null;
    const wv = isFiniteNumber(r.weightValue) ? r.weightValue : null;
    if (wf === null || wv === null || wf <= 0) return null;
    return clamp((wv / wf) * 100, 0, 100);
}

function getProgressByCalculation(
    row: ApiGanttRow,
    calculation: GanttProgressCalculation,
    percentCompleteType: GanttPercentCompleteType = "Physical",
    statusDate?: Date | null
): number {
    switch (calculation) {
        case "duration":
            return calculateDurationProgress(row, statusDate) ?? getActualProgress(row, percentCompleteType, statusDate);
        case "units":
            return calculateUnitsProgress(row) ?? getActualProgress(row, percentCompleteType, statusDate);
        case "weighted":
            return calculateWeightedProgress(row) ?? getActualProgress(row, percentCompleteType, statusDate);
        case "physical":
        default:
            return getActualProgress(row, percentCompleteType, statusDate);
    }
}

function getRemainingDuration(row: ApiGanttRow, effectiveProgress: number): number | null {
    const duration = toFiniteNumber(row.duration);
    if (duration !== null && duration >= 0) return Math.max(0, duration * (1 - clamp(effectiveProgress, 0, 100) / 100));
    return isFiniteNumber(row.remainingDuration) ? Math.max(0, row.remainingDuration) : null;
}

function getTotalFloat(row: ApiGanttRow): number | null {
    if (isFiniteNumber(row.totalFloat)) return row.totalFloat;
    if (isFiniteNumber(row.float)) return row.float;
    return null;
}

function getFreeFloat(row: ApiGanttRow): number | null {
    return isFiniteNumber(row.freeFloat) ? row.freeFloat : null;
}

function getDefaultCellFontSize(key: PmsColumnKey, baseSize: number): number {
    if (key === "activity") return Math.max(9, baseSize);
    if (key === "code") return Math.max(8.5, baseSize - 0.25);
    return Math.max(8, baseSize - 0.5);
}

function getDefaultCellFontWeight(row: ApiGanttRow, key: PmsColumnKey, requestedWeight: number): number {
    if (key === "activity") return row.type === "wbs" ? Math.max(650, requestedWeight) : Math.max(450, Math.min(550, requestedWeight));
    if (key === "code") return row.type === "wbs" ? 600 : 500;
    if (key === "status") return 600;
    if (key === "plannedProgress" || key === "actualProgress") return 550;
    return 450;
}

function getWbsFallbackColor(level: number, colors: GanttPalette, customColors?: GanttCustomColors): string {
    if (customColors) {
        if (level === 1) return customColors.wbsLevel1;
        if (level === 2) return customColors.wbsLevel2;
        if (level === 3) return customColors.wbsLevel3;
        return customColors.wbsLevel4;
    }
    if (level === 1) return colors.primary;
    if (level === 2) return colors.secondary;
    if (level === 3) return colors.wbsProgress;
    return colors.muted;
}

function getSemanticColumnColor(row: ApiGanttRow, key: PmsColumnKey, colors: GanttPalette, fallback: string): string {
    if (key === "status") return row.isCritical ? colors.error : getPhysicalProgress(row) >= 100 ? colors.success : getPhysicalProgress(row) > 0 ? colors.primary : colors.muted;
    if (key === "code") return row.type === "wbs" ? colors.text : colors.muted;
    if (["start", "finish", "duration", "remaining", "totalFloat", "freeFloat"].includes(key)) {
        const tf = getTotalFloat(row);
        if (key === "totalFloat" && tf !== null && tf < 0) return colors.error;
        return colors.muted;
    }
    return fallback;
}

function getSemanticIndicatorColor(row: ApiGanttRow, colors: GanttPalette, customColors?: GanttCustomColors): string {
    if (row.type === "wbs") return getWbsFallbackColor(row.level, colors, customColors);
    return colors.border;
}

type ActivityStatus = "Not Started" | "In Progress" | "Completed";

const ACTIVITY_STATUSES: ActivityStatus[] = [
    "Not Started",
    "In Progress",
    "Completed"
];

function normalizeActivityStatus(value?: string | null): ActivityStatus {
    const normalized = (value ?? "").trim().toLowerCase();
    if (["completed", "complete", "done", "finished", "100%", "100"].includes(normalized)) return "Completed";
    if (["in progress", "in-progress", "progress", "started", "ongoing", "active"].includes(normalized)) return "In Progress";
    return "Not Started";
}

function getStatusColor(status: ActivityStatus, colors: GanttPalette): string {
    if (status === "Completed") return colors.success;
    if (status === "In Progress") return colors.primary;
    return colors.muted;
}

function getActivityRowBackground(row: ApiGanttRow, colors: GanttPalette, customColors?: GanttCustomColors): string {
    void customColors;
    if (row.type === "wbs") return alpha(getWbsFallbackColor(row.level, colors, customColors), 0.10);
    return colors.paper;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatPmsDate(value: Date, format: GanttPmsDateFormat): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    switch (format) {
        case "DD/MM/YYYY": return `${day}/${month}/${year}`;
        case "MM/DD/YYYY": return `${month}/${day}/${year}`;
        case "DD-MMM-YYYY": return `${day}-${MONTHS[value.getMonth()]}-${year}`;
        case "YYYY-MM-DD":
        default: return `${year}-${month}-${day}`;
    }
}

function getCellValue(
    row: ApiGanttRow,
    key: PmsColumnKey,
    statusDate: Date | null | undefined,
    progressCalculation: GanttProgressCalculation,
    percentCompleteType: GanttPercentCompleteType,
    dateFormat: GanttPmsDateFormat
): ReactNode {
    void percentCompleteType;
    const schedule = getRowSchedule(row);
    const displayProgress = getProgressByCalculation(row, progressCalculation, percentCompleteType, statusDate);
    switch (key) {
        case "code": return row.code || "—";
        case "activity": return row.name || "—";
        case "start": return schedule.start ? formatPmsDate(schedule.start, dateFormat) : "—";
        case "finish": return schedule.finish ? formatPmsDate(schedule.finish, dateFormat) : "—";
        case "duration": {
            const start = schedule.start;
            const finish = schedule.finish;
            if (start && finish) {
                const elapsedDays = Math.floor((finish.getTime() - start.getTime()) / 86400000) + 1;
                if (Number.isFinite(elapsedDays) && elapsedDays >= 1) return formatNumericValue(elapsedDays);
            }
            return isFiniteNumber(row.duration) ? formatNumericValue(row.duration) : "—";
        }
        case "wf": { const v = (row as PmsCalculationRow).weightFactor; return v == null ? "—" : formatNumericValue(v); }
        case "wv": { const v = (row as PmsCalculationRow).weightValue; return v == null ? "—" : formatNumericValue(v); }
        case "plannedProgress": { const v = calculatePlannedProgress(row, statusDate); return v === null ? "—" : formatProgress(v); }
        case "actualProgress": return formatProgress(displayProgress);
        case "remaining": { const v = getRemainingDuration(row, displayProgress); return v === null ? "—" : formatNumericValue(v); }
        case "totalFloat": { const v = getTotalFloat(row); return v === null ? "—" : formatNumericValue(v); }
        case "freeFloat": { const v = getFreeFloat(row); return v === null ? "—" : formatNumericValue(v); }
        case "status": return row.status || "—";
        default: return "—";
    }
}

function isEditablePmsColumn(key: PmsColumnKey): boolean {
    return ["code", "activity", "start", "finish", "duration", "wf", "wv", "actualProgress", "remaining", "totalFloat", "freeFloat", "status"].includes(key);
}

function getEditInputType(key: PmsColumnKey): "text" | "number" | "date" {
    if (key === "start" || key === "finish") return "date";
    if (["duration", "wf", "wv", "actualProgress", "remaining", "totalFloat", "freeFloat"].includes(key)) return "number";
    return "text";
}

function toDateInputValue(value: unknown): string {
    if (!value) return "";

    // Date inputs represent a calendar date, not an instant in time.
    // When the API returns an ISO value, keep the first YYYY-MM-DD part
    // instead of passing the value through Date parsing, which can apply
    // the browser timezone and shift the visible date by one day.
    if (typeof value === "string") {
        const trimmed = value.trim();
        const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})(?:$|T|\s)/.exec(trimmed);
        if (isoDateMatch) {
            return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`;
        }
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
    }

    const parsed = parseDate(String(value));
    if (!parsed) return "";
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

type InlineEditState = { field: PmsColumnKey; value: string };
type BarStyle = "flat" | "gradient" | "threeD";

function normalizeBarStyle(value?: string): BarStyle {
    return value === "gradient" || value === "threeD" ? value : "flat";
}

function getBarBackground(row: ApiGanttRow, colors: GanttPalette, custom?: GanttCustomColors, getWbsColor?: (level: number) => string): string {
    if (row.type === "wbs") return getWbsColor ? getWbsColor(row.level) : getWbsFallbackColor(row.level, colors, custom);
    if (row.isCritical) return custom?.critical ?? colors.criticalProgress;
    if (row.isMilestone) return custom?.milestone ?? colors.milestone;
    return custom?.activity ?? colors.activityProgress;
}

function getBarBorder(row: ApiGanttRow, colors: GanttPalette): string {
    if (row.type === "wbs") return colors.wbsBorder;
    if (row.isCritical) return colors.criticalBorder;
    if (row.isMilestone) return colors.milestone;
    return colors.activityBorder;
}

function getBarGradient(background: string, style: BarStyle): string {
    if (style === "gradient") return `linear-gradient(180deg, ${background}, ${background} 42%, rgba(0,0,0,0.12))`;
    if (style === "threeD") return `linear-gradient(180deg, rgba(255,255,255,0.34) 0%, ${background} 20%, ${background} 68%, rgba(0,0,0,0.24) 100%)`;
    return background;
}

function getProgressBackground(progressColor: string, style: BarStyle, isWbs: boolean): string {
    const opacity = isWbs ? 0.72 : 0.82;
    if (style === "gradient") return `linear-gradient(180deg, ${alpha(progressColor, Math.min(1, opacity + 0.12))}, ${alpha(progressColor, opacity)}, ${alpha("#000000", 0.12)})`;
    if (style === "threeD") return `linear-gradient(180deg, ${alpha("#ffffff", 0.24)}, ${alpha(progressColor, Math.min(1, opacity + 0.04))} 28%, ${alpha(progressColor, opacity)} 70%, ${alpha("#000000", 0.18)})`;
    return alpha(progressColor, opacity);
}

function getBarShadow(style: BarStyle, selected: boolean, colors: GanttPalette): string {
    if (selected) return style === "threeD" ? `0 2px 4px rgba(15,23,42,0.24), 0 0 0 1px ${colors.selectedBorder}` : `0 0 0 1px ${colors.selectedBorder}`;
    if (style === "threeD") return "0 2px 3px rgba(15,23,42,0.20), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.16)";
    if (style === "gradient") return "0 1px 2px rgba(15,23,42,0.10)";
    return "none";
}

export default function GanttRow({
    row, index, side, colors, columns, rowHeight, selected, onSelect, onUpdate,
    fontFamily = "Vazirmatn", fontSize = 10, fontWeight = 500, fontItalic = false,
    fontColor, verticalAlignment = "center", dateFormat = "YYYY-MM-DD", expandedIds,
    toggleRow, timelineWidth = 480, dateToX, widthBetweenDates, timelineGridStep = 28,
    barStyle = "flat", customColors, getWbsColor, statusDate = null, statusDateVisible = false,
    progressCalculation = "duration", percentCompleteType = "Physical", showDataDate = false
}: GanttRowProps) {
    // Keep these public props available for callers/variants that use the row
    // index or status-date controls while preventing TS noUnusedParameters
    // regressions when a rendering branch does not reference them.
    void index;
    void statusDate;

    const effectiveFontColor = fontColor ?? colors.text;
    const visibleColumns = columns.visibleColumns ?? [];
    const columnWidths = columns.columnWidths ?? {};
    const columnAlignments = columns.columnAlignments ?? {};
    const columnStyles = columns.columnStyles ?? {};
    const effectiveBarStyle = normalizeBarStyle(barStyle);
    const displayProgress = getProgressByCalculation(row, progressCalculation, percentCompleteType, statusDate);

    const [editing, setEditing] = useState<InlineEditState | null>(null);
    const [editValue, setEditValue] = useState("");
    const [editError, setEditError] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    function getEditableValue(key: PmsColumnKey): string {
        const r = row as PmsCalculationRow;
        switch (key) {
            case "code": return row.code ?? "";
            case "activity": return row.name ?? "";
            case "start": return toDateInputValue(row.plannedStart);
            case "finish": return toDateInputValue(row.plannedFinish);
            case "duration": return row.duration != null ? String(row.duration) : "";
            case "wf": return r.weightFactor != null ? String(r.weightFactor) : "";
            case "wv": return r.weightValue != null ? String(r.weightValue) : "";
            case "actualProgress": return String(getProgressByCalculation(row, progressCalculation, percentCompleteType, statusDate));
            case "remaining": { const v = getRemainingDuration(row, displayProgress); return v == null ? "" : String(Math.round(v * 100) / 100); }
            case "totalFloat": { const v = getTotalFloat(row); return v == null ? "" : String(v); }
            case "freeFloat": { const v = getFreeFloat(row); return v == null ? "" : String(v); }
            case "status": return row.status ?? "";
            default: return "";
        }
    }

    function startEditing(field: PmsColumnKey) {
        if (!onUpdate || !isEditablePmsColumn(field)) return;
        const value = getEditableValue(field);
        setEditing({ field, value });
        setEditValue(value);
        setEditError("");
        requestAnimationFrame(() => { inputRef.current?.focus(); if (getEditInputType(field) === "text") inputRef.current?.select(); });
    }

    function cancelEditing() { setEditing(null); setEditValue(""); setEditError(""); }

    function commitEditing(): boolean {
        if (!editing || !onUpdate) return true;
        const field = editing.field;
        const raw = editValue.trim();
        if (field === "code" || field === "activity" || field === "status") {
            if (!raw && (field === "code" || field === "activity")) { setEditError(field === "code" ? "Activity ID cannot be empty." : "Activity Name cannot be empty."); return false; }
            const patch: Partial<ApiGanttRow> = field === "code" ? { code: raw } : field === "activity" ? { name: raw } : { status: raw };
            onUpdate(row.id, patch); cancelEditing(); return true;
        }
        if (field === "start" || field === "finish") {
            if (!raw) { setEditError(field === "start" ? "Start date is required." : "Finish date is required."); return false; }
            if (!parseDate(raw)) { setEditError("Invalid date."); return false; }
            const iso = `${raw}T00:00:00`;
            const constraintPatch = field === "start"
                ? { constraintType: "StartOn", constraintDate: iso, plannedStart: iso }
                : { constraintType: "FinishOn", constraintDate: iso, plannedFinish: iso };
            onUpdate(row.id, constraintPatch as unknown as Partial<ApiGanttRow>);
            cancelEditing(); return true;
        }
        const numeric = Number(raw);
        if (!Number.isFinite(numeric)) { setEditError("Enter a valid numeric value."); return false; }
        if (field === "actualProgress") { onUpdate(row.id, { progress: clamp(numeric, 0, 100) }); cancelEditing(); return true; }
        if (field === "duration") { if (numeric < 0) { setEditError("Duration cannot be negative."); return false; } onUpdate(row.id, { duration: numeric }); cancelEditing(); return true; }
        if (field === "remaining") { if (numeric < 0) { setEditError("Remaining duration cannot be negative."); return false; } onUpdate(row.id, { remainingDuration: numeric }); cancelEditing(); return true; }
        if (field === "totalFloat") { onUpdate(row.id, { totalFloat: numeric }); cancelEditing(); return true; }
        if (field === "freeFloat") { onUpdate(row.id, { freeFloat: numeric }); cancelEditing(); return true; }
        if (field === "wf" || field === "wv") {
            const patch = (field === "wf" ? { weightFactor: numeric } : { weightValue: numeric }) as unknown as Partial<ApiGanttRow>;
            onUpdate(row.id, patch); cancelEditing(); return true;
        }
        return false;
    }

    function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" || event.key === "Tab") { event.preventDefault(); commitEditing(); }
        else if (event.key === "Escape") { event.preventDefault(); cancelEditing(); }
    }

    if (side === "pms") {
        return (
            <Box onClick={() => onSelect(row.id)} sx={{ width: "100%", height: rowHeight, minHeight: rowHeight, display: "flex", flexShrink: 0, overflow: "hidden", boxSizing: "border-box", backgroundColor: selected ? colors.selected : getActivityRowBackground(row, colors, customColors), borderBottom: `1px solid ${colors.border}`, borderLeft: selected ? `2px solid ${colors.selectedBorder}` : "2px solid transparent", cursor: "default", "&:hover": { backgroundColor: selected ? colors.selected : colors.hover } }}>
                {visibleColumns.map(column => {
                    const width = columnWidths[column.key] ?? column.width;
                    const alignment = columnAlignments[column.key] ?? column.align ?? "left";
                    const isActivity = column.key === "activity";
                    const isCode = column.key === "code";
                    const isStatus = column.key === "status";
                    const isNumeric = !isActivity && !isCode && !isStatus;
                    const hasChildren = row.type === "wbs" && Boolean(row.children?.length);
                    const expanded = row.type === "wbs" && expandedIds.has(row.id);
                    const configuredStyle = columnStyles[column.key];
                    const style = normalizeColumnStyle(configuredStyle, { fontFamily, fontSize: getDefaultCellFontSize(column.key, fontSize), fontWeight: getDefaultCellFontWeight(row, column.key, fontWeight), fontItalic, fontColor: effectiveFontColor, verticalAlignment });
                    const cellColor = configuredStyle?.fontColor ?? getSemanticColumnColor(row, column.key, colors, effectiveFontColor);
                    const semanticIndicator = getSemanticIndicatorColor(row, colors, customColors);
                    const isEditing = Boolean(editing && editing.field === column.key);
                    const canEdit = Boolean(onUpdate) && isEditablePmsColumn(column.key);
                    const editInputType = getEditInputType(column.key);
                    return (
                        <Box key={column.key} onClick={event => { event.stopPropagation(); if (canEdit && (!editing || editing.field !== column.key)) startEditing(column.key); else onSelect(row.id); }} onDoubleClick={canEdit ? event => { event.stopPropagation(); startEditing(column.key); } : undefined} sx={{ position: "relative", width, minWidth: width, maxWidth: width, height: "100%", display: "flex", alignItems: getFlexVerticalAlignment(style.verticalAlignment), justifyContent: alignment === "right" ? "flex-end" : alignment === "center" ? "center" : "flex-start", px: isActivity ? 0.65 : 0.5, borderRight: `1px solid ${colors.border}`, overflow: "hidden", boxSizing: "border-box", backgroundColor: "transparent", cursor: canEdit ? "text" : "default", "&:hover": { backgroundColor: canEdit ? alpha(semanticIndicator, 0.12) : alpha(semanticIndicator, 0.055) } }}>
                            {(isActivity || isCode) && <Box sx={{ position: "absolute", left: 0, top: 3, bottom: 3, width: row.type === "wbs" ? 3 : 2, borderRadius: "0 2px 2px 0", backgroundColor: semanticIndicator, opacity: row.type === "wbs" ? 0.9 : 0.75, pointerEvents: "none" }} />}
                            {isActivity && <>{hasChildren ? <IconButton size="small" onClick={event => { event.stopPropagation(); toggleRow(row.id); }} sx={{ width: 22, height: 22, flexShrink: 0, mr: 0.25, color: expanded ? semanticIndicator : colors.muted }} >{expanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}</IconButton> : <Box sx={{ width: 22, flexShrink: 0 }} />}<Box sx={{ width: Math.max(0, row.level * 14), flexShrink: 0 }} /></>}
                            {isEditing && isStatus ? <Box sx={{ display: "flex", alignItems: "center", width: "100%", minWidth: 0, height: "100%", position: "relative", zIndex: 20 }}>
                                <Select
                                    autoFocus
                                    value={normalizeActivityStatus(editValue)}
                                    onChange={event => {
                                        event.stopPropagation();
                                        const value = event.target.value as ActivityStatus;
                                        setEditValue(value);
                                        onUpdate?.(row.id, { status: value });
                                        cancelEditing();
                                    }}
                                    onClose={() => cancelEditing()}
                                    variant="standard"
                                    fullWidth
                                    disableUnderline
                                    sx={{
                                        minWidth: 0,
                                        fontFamily: style.fontFamily,
                                        fontSize: `${style.fontSize}px`,
                                        fontWeight: style.fontWeight,
                                        color: getStatusColor(normalizeActivityStatus(editValue), colors),
                                        backgroundColor: alpha(getStatusColor(normalizeActivityStatus(editValue), colors), 0.08),
                                        border: `1px solid ${alpha(getStatusColor(normalizeActivityStatus(editValue), colors), 0.38)}`,
                                        borderRadius: 0.65,
                                        px: 0.45,
                                        height: Math.max(20, rowHeight - 4),
                                        "& .MuiSelect-select": { py: 0.1, minHeight: "unset !important", display: "flex", alignItems: "center" },
                                        "& .MuiSelect-icon": { fontSize: 15 }
                                    }}
                                >
                                    {ACTIVITY_STATUSES.map(status => (
                                        <MenuItem key={status} value={status} sx={{ fontSize: `${Math.max(10, style.fontSize)}px`, fontFamily: style.fontFamily }}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box> : isEditing ? <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, width: "100%", minWidth: 0, height: "100%", position: "relative", zIndex: 20 }}>
                                <TextField inputRef={inputRef} autoFocus type={editInputType} value={editValue} onChange={event => { setEditValue(event.target.value); if (editError) setEditError(""); }} onKeyDown={handleEditKeyDown} error={Boolean(editError)} variant="standard" fullWidth InputProps={{ disableUnderline: true }} inputProps={{ step: editInputType === "number" ? "any" : undefined, min: editInputType === "number" && (column.key === "duration" || column.key === "remaining") ? 0 : undefined }} sx={{ minWidth: 0, flex: 1, "& input": { minWidth: 0, width: "100%", py: 0, px: 0.55, fontFamily: style.fontFamily, fontSize: `${style.fontSize}px`, fontWeight: style.fontWeight, fontStyle: style.fontItalic ? "italic" : "normal", color: colors.text, backgroundColor: alpha(colors.primary, 0.07), border: `1px solid ${alpha(colors.primary, 0.45)}`, borderRadius: 0.65, boxSizing: "border-box" }, "& .MuiFormHelperText-root": { display: "none" } }} />
                                <IconButton size="small" onClick={event => { event.stopPropagation(); commitEditing(); }} sx={{ width: 20, height: 20, flexShrink: 0, color: colors.success }}><Check sx={{ fontSize: 15 }} /></IconButton>
                                <IconButton size="small" onClick={event => { event.stopPropagation(); cancelEditing(); }} sx={{ width: 20, height: 20, flexShrink: 0, color: colors.error }}><Close sx={{ fontSize: 15 }} /></IconButton>
                            </Box> : <Box sx={{ display: "flex", alignItems: "center", minWidth: 0, width: "100%", height: "100%" }}><Typography component="span" noWrap sx={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", fontFamily: style.fontFamily, fontSize: `${style.fontSize}px`, fontWeight: style.fontWeight, fontStyle: style.fontItalic ? "italic" : "normal", color: cellColor, lineHeight: 1.2, letterSpacing: isNumeric ? "0" : "0.005em", fontVariantNumeric: "tabular-nums", userSelect: canEdit ? "text" : "none" }}>{isStatus ? (
                                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.45, maxWidth: "100%", px: 0.7, py: 0.15, borderRadius: 10, backgroundColor: alpha(getStatusColor(normalizeActivityStatus(row.status), colors), 0.12), border: `1px solid ${alpha(getStatusColor(normalizeActivityStatus(row.status), colors), 0.28)}`, color: getStatusColor(normalizeActivityStatus(row.status), colors), fontSize: `${Math.max(9, style.fontSize - 0.5)}px`, fontWeight: 650, lineHeight: 1.35 }}>
                                        <Box component="span" sx={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: getStatusColor(normalizeActivityStatus(row.status), colors), flexShrink: 0 }} />
                                        {normalizeActivityStatus(row.status)}
                                    </Box>
                                ) : getCellValue(row, column.key, statusDate, progressCalculation, percentCompleteType, dateFormat)}</Typography>{canEdit && <EditOutlined sx={{ flexShrink: 0, ml: 0.3, fontSize: 12, opacity: 0, color: colors.primary, ".MuiBox-root:hover &": { opacity: 0.75 } }} />}</Box>}
                        </Box>
                    );
                })}
                {editError && <Box sx={{ display: "none" }}>{editError}</Box>}
            </Box>
        );
    }

    const schedule = getRowSchedule(row);
    const start = schedule.start ?? parseDate(row.plannedStart) ?? parseDate(row.actualStart);
    const finish = schedule.finish ?? parseDate(row.plannedFinish) ?? parseDate(row.actualFinish);
    const canDrawBar = Boolean(start && finish && dateToX && widthBetweenDates);
    const rawStartX = canDrawBar && start && dateToX ? dateToX(start) : 0;
    const rawWidth = canDrawBar && start && finish && widthBetweenDates ? widthBetweenDates(start, finish) : 0;
    const barStart = clamp(rawStartX, 0, timelineWidth);
    const barWidth = clamp(rawWidth, 4, Math.max(4, timelineWidth - barStart));
    const isWbs = row.type === "wbs";
    const isMilestone = Boolean(row.isMilestone || (start && finish && start.getTime() === finish.getTime()));
    const barBackground = getBarBackground(row, colors, customColors, getWbsColor);
    const barBorder = getBarBorder(row, colors);
    const progressColor = row.isCritical ? (customColors?.critical ?? colors.criticalProgress) : isWbs ? (getWbsColor ? getWbsColor(row.level) : getWbsFallbackColor(row.level, colors, customColors)) : (customColors?.activity ?? colors.activityProgress);
    const barFill = getBarGradient(barBackground, effectiveBarStyle);
    const progressFill = getProgressBackground(progressColor, effectiveBarStyle, isWbs);
    const barRadius = isWbs ? (effectiveBarStyle === "threeD" ? 3 : 2) : (effectiveBarStyle === "threeD" ? 4 : 3);
    const dataDateX = statusDate && statusDateVisible && showDataDate && dateToX ? dateToX(statusDate) : null;
    const safeGridStep = Number.isFinite(timelineGridStep) && timelineGridStep > 4 ? timelineGridStep : 28;
    const gridLinePosition = Math.max(4, safeGridStep - 1);
    const barLabelSize = Math.max(8, Math.min(9.5, fontSize));

    return (
        <Box onClick={() => onSelect(row.id)} sx={{ position: "relative", width: timelineWidth, minWidth: timelineWidth, height: rowHeight, minHeight: rowHeight, flexShrink: 0, overflow: "hidden", backgroundColor: selected ? colors.selected : index % 2 === 1 ? colors.zebra : colors.paper, borderBottom: `1px solid ${colors.border}`, boxSizing: "border-box", "&:hover": { backgroundColor: selected ? colors.selected : colors.hover } }}>
            <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${gridLinePosition}px, ${alpha(colors.gridLight, 0.48)} ${safeGridStep}px)`, backgroundSize: `${safeGridStep}px 100%` }} />
            {selected && <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, backgroundColor: colors.selectedBorder, zIndex: 10 }} />}
            {dataDateX !== null && <Box sx={{ position: "absolute", left: dataDateX, top: 0, bottom: 0, width: 0, borderLeft: `3px dashed ${colors.error}`, zIndex: 8, pointerEvents: "none" }} />}
            {canDrawBar && !isMilestone && <Box sx={{ position: "absolute", left: barStart, top: verticalAlignment === "top" ? 3 : verticalAlignment === "bottom" ? rowHeight - (isWbs ? 18 : 20) : Math.max(3, rowHeight / 2 - (isWbs ? 7 : 8)), width: barWidth, height: isWbs ? 14 : 16, borderRadius: barRadius, background: barFill, border: `1px solid ${barBorder}`, boxSizing: "border-box", overflow: "hidden", zIndex: 4, boxShadow: getBarShadow(effectiveBarStyle, selected, colors) }}>
                {displayProgress > 0 && <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${clamp(displayProgress, 0, 100)}%`, background: progressFill, pointerEvents: "none", zIndex: 1 }} />}
                <Box sx={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, backgroundColor: effectiveBarStyle === "gradient" ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.22)", pointerEvents: "none", zIndex: 3 }} />
                {barWidth > 90 && <Typography component="span" noWrap sx={{ position: "absolute", left: 6, right: 6, top: "50%", transform: "translateY(-50%)", overflow: "hidden", textOverflow: "ellipsis", color: "#ffffff", fontFamily, fontSize: `${barLabelSize}px`, fontWeight: isWbs ? 600 : 500, fontStyle: fontItalic ? "italic" : "normal", lineHeight: 1, pointerEvents: "none", zIndex: 5 }}>{row.name}</Typography>}
            </Box>}
            {canDrawBar && isMilestone && start && <Box sx={{ position: "absolute", left: dateToX!(start) - 7, top: verticalAlignment === "top" ? 5 : verticalAlignment === "bottom" ? rowHeight - 19 : rowHeight / 2 - 7, width: 14, height: 14, transform: "rotate(45deg)", backgroundColor: row.isCritical ? (customColors?.critical ?? colors.milestoneCritical) : (customColors?.milestone ?? colors.milestone), border: `1px solid ${barBorder}`, boxSizing: "border-box", zIndex: 5 }} />}
            {!canDrawBar && <Box sx={{ position: "absolute", left: 8, right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 0.7, minWidth: 0, zIndex: 3 }}><Box sx={{ width: 7, height: 7, flexShrink: 0, borderRadius: isWbs ? 1 : "50%", backgroundColor: barBackground }} /><Typography component="span" noWrap sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", fontFamily, fontSize: `${Math.max(8.5, fontSize)}px`, fontWeight: isWbs ? 600 : 450, fontStyle: fontItalic ? "italic" : "normal", color: effectiveFontColor, lineHeight: 1.2 }}>{row.name}</Typography></Box>}
            {row.isCritical && <Box sx={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 2, backgroundColor: colors.error, opacity: 0.9, zIndex: 9, pointerEvents: "none" }} />}
        </Box>
    );
}
