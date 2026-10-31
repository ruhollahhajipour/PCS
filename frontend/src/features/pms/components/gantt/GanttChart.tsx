import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Slider
} from "@mui/material";
import {
    FormatBold,
    FormatItalic,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    Palette,
    ChevronRight
} from "@mui/icons-material";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import type { ReactNode } from "react";
import {
    alpha,
    useTheme
} from "@mui/material/styles";
import type {
    Theme
} from "@mui/material/styles";
import GanttToolbar from "./components/GanttToolbar";
import GanttColumnsPopover from "./components/GanttColumnsPopover";
import GanttRow from "./components/GanttRow";
import GanttHeader from "./components/GanttHeader";
import GanttTimelineHeader from "./components/GanttTimelineHeader";
import CalendarManager from "./CalendarManager";
import RelationshipEditor from "./RelationshipEditor";
import GanttRelationshipLayer from "./GanttRelationshipLayer";
import {
    useGanttTree
} from "./hooks/useGanttTree";
import {
    useGanttColumns
} from "./hooks/useGanttColumns";
import {
    useGanttTimeline
} from "./hooks/useGanttTimeline";
import type {
    GanttChartProps,
    GanttColorPreset,
    GanttCustomColors,
    GanttColorSettings,
    ProgressCalculationType,
    TimelineScale
} from "./ganttTypes";
import {
    ROW_HEIGHT,
    DEFAULT_DAY_WIDTH,
    DEFAULT_TIMELINE_SCALE,
    MIN_DAY_WIDTH,
    MAX_DAY_WIDTH,
    STORAGE_KEY
} from "./ganttConstants";
import {
    clamp,
    parseDate
} from "./ganttUtils";
import type {
    GanttRow as ApiGanttRow
} from "../../api/ganttApi";
import { buildGanttSummaryRows } from "./utils/ganttSummary";
import {
    adaptGanttRowsToSchedule,
    applyScheduleResultToRows,
    buildScheduleOptions,
    createDefaultCalendarRegistry,
    scheduleProject
} from "../../scheduling";
const MIN_ROW_HEIGHT = 25;
const MAX_ROW_HEIGHT = 44;
const SETTINGS_PANEL_HEIGHT = 208;
const DEFAULT_DISPLAY_FONT_FAMILY =
    "Vazirmatn";
const PMS_GANTT_GAP = 5;
const PMS_GANTT_BORDER = "1px solid rgba(100, 116, 139, 0.30)";
const ACTIVITY_CALENDAR_STORAGE_KEY = "pcs-pms-activity-calendars-v1";
function cloneRows(
    rows: ApiGanttRow[]
): ApiGanttRow[] {
    return rows.map(row => ({
        ...row,
        children: row.children
            ? cloneRows(row.children)
            : row.children
    }));
}

function countWbsRows(row: ApiGanttRow): number {
    const childCount = (row.children ?? []).reduce(
        (sum, child) => sum + countWbsRows(child),
        0
    );
    return (row.type === "wbs" && row.level > 0 ? 1 : 0) + childCount;
}

type GanttBaseCustomColors = {
    wbsLevel1: string;
    wbsLevel2: string;
    wbsLevel3: string;
    wbsLevel4: string;
    activity: string;
    critical: string;
    milestone: string;
};

function withExtendedWbsColors(
    base: GanttBaseCustomColors
): GanttCustomColors {
    return {
        ...base,
        wbsLevel5: alpha(base.wbsLevel4, 0.90),
        wbsLevel6: alpha(base.wbsLevel4, 0.84),
        wbsLevel7: alpha(base.wbsLevel4, 0.78),
        wbsLevel8: alpha(base.wbsLevel4, 0.72),
        wbsLevel9: alpha(base.wbsLevel4, 0.66),
        wbsLevel10: alpha(base.wbsLevel4, 0.60),
        wbsLevel11: alpha(base.wbsLevel4, 0.54),
        wbsLevel12: alpha(base.wbsLevel4, 0.48),
        wbsLevel13: alpha(base.wbsLevel4, 0.44),
        wbsLevel14: alpha(base.wbsLevel4, 0.40),
        wbsLevel15: alpha(base.wbsLevel4, 0.36),
        wbsLevel16: alpha(base.wbsLevel4, 0.32),
        wbsLevel17: alpha(base.wbsLevel4, 0.28),
        wbsLevel18: alpha(base.wbsLevel4, 0.24),
        wbsLevel19: alpha(base.wbsLevel4, 0.20),
        wbsLevel20: alpha(base.wbsLevel4, 0.16)
    };
}

function getDefaultCustomColors(
    theme: Theme
): GanttCustomColors {
    return withExtendedWbsColors({
        wbsLevel1:
            theme.palette.primary.main,
        wbsLevel2:
            theme.palette.primary.dark,
        wbsLevel3:
            theme.palette.primary.light,
        wbsLevel4:
            alpha(
                theme.palette.primary.light,
                0.72
            ),
        activity:
            theme.palette.primary.main,
        critical:
            theme.palette.error.main,
        milestone:
            theme.palette.warning.main
    });
}
function getPresetColors(
    preset: GanttColorPreset,
    theme: Theme,
    custom: GanttCustomColors
): GanttCustomColors {
    switch (preset) {
        case "corporate":
            return withExtendedWbsColors({
                wbsLevel1: "#2F75B5",
                wbsLevel2: "#5B9BD5",
                wbsLevel3: "#9DC3E6",
                wbsLevel4: "#BDD7EE",
                activity: "#4472C4",
                critical: "#C00000",
                milestone: "#ED7D31"
            });
        case "engineering":
            return withExtendedWbsColors({
                wbsLevel1: "#1F4E78",
                wbsLevel2: "#2F75B5",
                wbsLevel3: "#5B9BD5",
                wbsLevel4: "#9DC3E6",
                activity: "#2E75B6",
                critical: "#C00000",
                milestone: "#ED7D31"
            });
        case "p6":
            return withExtendedWbsColors({
                wbsLevel1: "#4472C4",
                wbsLevel2: "#5B9BD5",
                wbsLevel3: "#A5A5A5",
                wbsLevel4: "#D9E2F3",
                activity: "#70AD47",
                critical: "#C00000",
                milestone: "#FFC000"
            });
        case "slate":
            return withExtendedWbsColors({
                wbsLevel1: "#34495E",
                wbsLevel2: "#4F81BD",
                wbsLevel3: "#76A5D3",
                wbsLevel4: "#B4C7E7",
                activity: "#5B9BD5",
                critical: "#C00000",
                milestone: "#ED7D31"
            });
        case "highContrast":
            return withExtendedWbsColors({
                wbsLevel1: "#0B4EA2",
                wbsLevel2: "#1469D2",
                wbsLevel3: "#00A7C4",
                wbsLevel4: "#00A88F",
                activity: "#1469D2",
                critical: "#D71920",
                milestone: "#F57C00"
            });
        case "theme":
            return getDefaultCustomColors(theme);
        case "custom":
        default:
            return custom;
    }
}
type PmsHorizontalAlignment =
    "left" | "center" | "right";
type PmsFontFamily =
    | "Vazirmatn"
    | "Segoe UI"
    | "Tahoma"
    | "Arial"
    | "Calibri"
    | "Times New Roman";
type PmsDateFormat =
    | "YYYY-MM-DD"
    | "DD/MM/YYYY"
    | "MM/DD/YYYY"
    | "DD-MMM-YYYY";
function PmsFormatToolbar({
    colors,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    bold,
    setBold,
    italic,
    setItalic,
    fontColor,
    setFontColor,
    dateFormat,
    setDateFormat,
    globalAlignment,
    setGlobalAlignment,
    onApplyStyle
}: {
    colors: {
        paper: string;
        surface: string;
        border: string;
        text: string;
        muted: string;
        primary: string;
        hover: string;
    };
    fontFamily: PmsFontFamily;
    setFontFamily: (value: PmsFontFamily) => void;
    fontSize: number;
    setFontSize: (value: number) => void;
    bold: boolean;
    setBold: (value: boolean) => void;
    italic: boolean;
    setItalic: (value: boolean) => void;
    fontColor: string;
    setFontColor: (value: string) => void;
    dateFormat: PmsDateFormat;
    setDateFormat: (value: PmsDateFormat) => void;
    globalAlignment: PmsHorizontalAlignment;
    setGlobalAlignment: (value: PmsHorizontalAlignment) => void;
    onApplyStyle: (patch: {
        fontFamily?: PmsFontFamily;
        fontSize?: number;
        fontWeight?: number;
        fontItalic?: boolean;
        fontColor?: string;
    }) => void;
}) {
    const controlSx = {
        height: 30,
        minHeight: 30,
        fontSize: 10.5,
        borderRadius: 1,
        backgroundColor: colors.paper,
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.border
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primary
        },
        "& .MuiSelect-select": {
            py: 0.5,
            px: 1,
            minHeight: "unset !important"
        },
        "& label": {
            fontSize: 10
        }
    } as const;
    const segmentSx = {
        height: 30,
        flexShrink: 0,
        "& .MuiToggleButton-root": {
            minWidth: 30,
            px: 0.7,
            py: 0.3,
            borderColor: colors.border,
            color: colors.muted,
            backgroundColor: colors.paper,
            "&.Mui-selected": {
                color: colors.primary,
                backgroundColor: alpha(colors.primary, 0.16),
                borderColor: alpha(colors.primary, 0.38)
            },
            "&:hover": {
                backgroundColor: colors.hover
            }
        }
    } as const;
    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
                px: 1,
                py: 0.75,
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gridTemplateRows: "repeat(3, 30px)",
                alignItems: "center",
                columnGap: 0.65,
                rowGap: 0.55,
                overflow: "hidden",
                fontFamily: "Vazirmatn",
                backgroundColor: colors.paper
            }}
        >
            <FormControl size="small" sx={{ minWidth: 0 }}>
                <InputLabel>Font</InputLabel>
                <Select
                    label="Font"
                    value={fontFamily}
                    sx={controlSx}
                    onChange={event => {
                        const value = event.target.value as PmsFontFamily;
                        setFontFamily(value);
                        onApplyStyle({ fontFamily: value });
                    }}
                >
                    <MenuItem value="Vazirmatn">Vazirmatn</MenuItem>
                    <MenuItem value="Segoe UI">Segoe UI</MenuItem>
                    <MenuItem value="Tahoma">Tahoma</MenuItem>
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Calibri">Calibri</MenuItem>
                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 0 }}>
                <InputLabel>Size</InputLabel>
                <Select
                    label="Size"
                    value={String(fontSize)}
                    sx={controlSx}
                    onChange={event => {
                        const value = Number(event.target.value);
                        setFontSize(value);
                        onApplyStyle({ fontSize: value });
                    }}
                >
                    {[9, 10, 11, 12, 13, 14, 15, 16].map(value => (
                        <MenuItem key={value} value={String(value)}>{value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ToggleButtonGroup size="small" exclusive={false} sx={{ ...segmentSx, justifySelf: "stretch" }}>
                <ToggleButton
                    value="bold"
                    selected={bold}
                    aria-label="Bold"
                    onChange={() => {
                        const next = !bold;
                        setBold(next);
                        onApplyStyle({ fontWeight: next ? 700 : 400 });
                    }}
                >
                    <FormatBold sx={{ fontSize: 17 }} />
                </ToggleButton>
                <ToggleButton
                    value="italic"
                    selected={italic}
                    aria-label="Italic"
                    onChange={() => {
                        const next = !italic;
                        setItalic(next);
                        onApplyStyle({ fontItalic: next });
                    }}
                >
                    <FormatItalic sx={{ fontSize: 17 }} />
                </ToggleButton>
            </ToggleButtonGroup>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.45,
                    px: 0.6,
                    height: 30,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 1,
                    backgroundColor: colors.paper,
                    minWidth: 0,
                    justifySelf: "stretch"
                }}
            >
                <Palette sx={{ fontSize: 15, color: colors.muted }} />
                <input
                    aria-label="PMS font color"
                    type="color"
                    value={fontColor}
                    onChange={event => {
                        const value = event.target.value;
                        setFontColor(value);
                        onApplyStyle({ fontColor: value });
                    }}
                    style={{
                        width: 25,
                        height: 22,
                        border: 0,
                        padding: 0,
                        background: "transparent",
                        cursor: "pointer"
                    }}
                />
            </Box>
            <ToggleButtonGroup
                exclusive
                value={globalAlignment}
                onChange={(_, value) => {
                    if (!value) return;
                    setGlobalAlignment(value);
                }}
                size="small"
                sx={{ ...segmentSx, justifySelf: "stretch" }}
            >
                <ToggleButton value="left" aria-label="Align left"><FormatAlignLeft sx={{ fontSize: 17 }} /></ToggleButton>
                <ToggleButton value="center" aria-label="Align center"><FormatAlignCenter sx={{ fontSize: 17 }} /></ToggleButton>
                <ToggleButton value="right" aria-label="Align right"><FormatAlignRight sx={{ fontSize: 17 }} /></ToggleButton>
            </ToggleButtonGroup>
            <FormControl size="small" sx={{ minWidth: 0 }}>
                <InputLabel>Date</InputLabel>
                <Select
                    label="Date"
                    value={dateFormat}
                    sx={controlSx}
                    onChange={event => setDateFormat(event.target.value as PmsDateFormat)}
                >
                    <MenuItem value="YYYY-MM-DD">2026-09-07</MenuItem>
                    <MenuItem value="DD/MM/YYYY">07/09/2026</MenuItem>
                    <MenuItem value="MM/DD/YYYY">09/07/2026</MenuItem>
                    <MenuItem value="DD-MMM-YYYY">07-Sep-2026</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
function SettingsSelectRow({
    label, value, options, onChange, colors, disabled = false
}: {
    label: string;
    value: string;
    options: Array<[string, string]>;
    onChange: (value: string) => void;
    disabled?: boolean;
    colors: { paper: string; surface: string; border: string; text: string; muted: string; primary: string; hover: string };
}) {
    return (
        <Box sx={{ px: 0.8, py: 0.22, display: "grid", gridTemplateColumns: "minmax(0, 1fr) 130px", alignItems: "center", gap: 1, direction: "ltr" }}>
            <Typography sx={{ fontSize: 7.8, fontWeight: 700, color: colors.muted, whiteSpace: "nowrap" }}>{label}</Typography>
            <FormControl size="small" fullWidth>
                <Select
                    value={value}
                    disabled={disabled}
                    onChange={event => onChange(String(event.target.value))}
                    sx={{
                        height: 24, fontSize: 7.8, fontWeight: 700, color: colors.primary, backgroundColor: alpha(colors.primary, 0.055),
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha(colors.primary, 0.22) },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary },
                        "& .MuiSelect-select": { py: 0.25, px: 0.75, minHeight: "unset !important" }
                    }}
                >
                    {options.map(([optionValue, optionLabel]) => <MenuItem key={optionValue} value={optionValue} sx={{ fontSize: 9.5 }}>{optionLabel}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}
function PmsSettingsSection({ title, colors, open, onToggle, children, compact = false, visible = true }: {
    title: string;
    colors: { paper: string; surface: string; border: string; text: string; muted: string; primary: string; hover: string };
    open: boolean;
    onToggle: () => void;
    children: ReactNode;
    compact?: boolean;
    visible?: boolean;
}) {
    if (!visible) return null;
    return (
        <Box sx={{ minWidth: 0, minHeight: 0, height: compact ? "auto" : "100%", border: `1px solid ${colors.border}`, borderRadius: 1, backgroundColor: colors.paper, overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
            <Box onClick={onToggle} role="button" tabIndex={0} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") onToggle(); }} sx={{ height: 31, minHeight: 31, px: 0.7, display: "flex", alignItems: "center", gap: 0.35, cursor: "pointer", borderBottom: `1px solid ${colors.border}`, backgroundColor: alpha(colors.primary, 0.055), color: colors.text, userSelect: "none" }}>
                <ChevronRight sx={{ fontSize: 17, color: colors.primary, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .18s ease" }} />
                <Typography sx={{ fontSize: 8.5, fontWeight: 900, letterSpacing: 0.35 }}>{title}</Typography>
                <Box sx={{ flex: 1 }} />
                <Typography sx={{ fontSize: 8, color: colors.muted }}>{open ? "OPEN" : "HIDDEN"}</Typography>
            </Box>
            {open && <Box sx={{ flex: compact ? "0 0 auto" : 1, minHeight: 0, overflow: "hidden", py: 0.25 }}>{children}</Box>}
        </Box>
    );
}
export default function GanttChart(
    props: GanttChartProps & {
        onRowUpdate?: (
            rowId: string,
            patch: Partial<ApiGanttRow>
        ) => void;
    }
) {
    const {
        rows,
        projectDuration,
        wbsCount,
        statusDate,
        onRowUpdate,
        onSaveRelationships
    } = props;
    const theme = useTheme();
    const [
        editableRows,
        setEditableRows
    ] = useState<ApiGanttRow[]>(
        () => cloneRows(rows)
    );
    useEffect(() => {
        setEditableRows(
            cloneRows(rows)
        );
    }, [rows]);
    const [
        colorSettings,
        setColorSettings
    ] = useState<GanttColorSettings>(
        () => {
            const defaults:
                GanttColorSettings = {
                preset: "theme",
                custom:
                    getDefaultCustomColors(
                        theme
                    )
            };
            try {
                const raw =
                    window.localStorage.getItem(
                        STORAGE_KEY
                    );
                if (!raw) {
                    return defaults;
                }
                const parsed =
                    JSON.parse(
                        raw
                    ) as Partial<GanttColorSettings>;
                return {
                    preset:
                        parsed.preset ??
                        defaults.preset,
                    custom: {
                        ...defaults.custom,
                        ...(parsed.custom ?? {})
                    }
                };
            } catch {
                return defaults;
            }
        }
    );
    useEffect(() => {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(colorSettings)
            );
        } catch {
            // Browser storage can be unavailable; keep the in-memory settings.
        }
    }, [colorSettings]);
    const effectiveCustomColors =
        useMemo(
            () =>
                getPresetColors(
                    colorSettings.preset,
                    theme,
                    colorSettings.custom
                ),
            [
                colorSettings.preset,
                colorSettings.custom,
                theme
            ]
        );
    const colors = useMemo(
        () => ({
            paper:
                theme.palette.background
                    .paper,
            surface:
                theme.palette.mode ===
                "dark"
                    ? theme.palette
                          .background
                          .default
                    : alpha(
                          theme.palette
                              .background
                              .default,
                          0.72
                      ),
            background:
                theme.palette.background
                    .default,
            header:
                alpha(
                    theme.palette.primary
                        .main,
                    theme.palette.mode ===
                        "dark"
                        ? 0.16
                        : 0.055
                ),
            subHeader:
                alpha(
                    theme.palette.primary
                        .main,
                    theme.palette.mode ===
                        "dark"
                        ? 0.09
                        : 0.025
                ),
            border:
                alpha(
                    theme.palette.divider,
                    theme.palette.mode ===
                        "dark"
                        ? 0.9
                        : 0.85
                ),
            grid:
                alpha(
                    theme.palette.divider,
                    0.9
                ),
            gridLight:
                alpha(
                    theme.palette.divider,
                    0.55
                ),
            text:
                theme.palette.text.primary,
            muted:
                theme.palette.text.secondary,
            primary:
                theme.palette.primary.main,
            secondary:
                theme.palette.secondary.main,
            activityBackground:
                effectiveCustomColors.activity,
            activityBorder:
                effectiveCustomColors.activity,
            activityProgress:
                effectiveCustomColors.activity,
            criticalBackground:
                effectiveCustomColors.critical,
            criticalBorder:
                effectiveCustomColors.critical,
            criticalProgress:
                effectiveCustomColors.critical,
            wbsBackground:
                effectiveCustomColors.wbsLevel1,
            wbsBorder:
                effectiveCustomColors.wbsLevel1,
            wbsProgress:
                effectiveCustomColors.wbsLevel1,
            milestone:
                effectiveCustomColors.milestone,
            milestoneCritical:
                effectiveCustomColors.critical,
            float:
                theme.palette.text.secondary,
            selected:
                alpha(
                    theme.palette.primary
                        .main,
                    0.1
                ),
            selectedBorder:
                theme.palette.primary.main,
            hover:
                alpha(
                    theme.palette.primary
                        .main,
                    0.055
                ),
            zebra:
                alpha(
                    theme.palette.primary
                        .main,
                    0.018
                ),
            success:
                theme.palette.success.main,
            warning:
                theme.palette.warning.main,
            error:
                theme.palette.error.main
        }),
        [
            theme,
            effectiveCustomColors
        ]
    );
    const columns =
        useGanttColumns();
    type PmsHorizontalAlignment =
        "left" | "center" | "right";
    const [
        globalPmsAlignment,
        setGlobalPmsAlignment
    ] = useState<PmsHorizontalAlignment>(
        () => {
            const first =
                columns.visibleColumns[0];
            const persisted = first
                ? columns.columnAlignments[first.key]
                : undefined;
            return persisted === "center" ||
                persisted === "right" ||
                persisted === "left"
                ? persisted
                : "left";
        }
    );
    const effectiveColumnAlignments =
        useMemo(() => {
            const result = {
                ...columns.columnAlignments
            };
            for (const column of
                columns.visibleColumns) {
                result[column.key] =
                    globalPmsAlignment;
            }
            return result;
        }, [
            columns.columnAlignments,
            columns.visibleColumns,
            globalPmsAlignment
        ]);
    const effectiveColumns =
        useMemo(
            () => ({
                ...columns,
                columnAlignments:
                    effectiveColumnAlignments
            }),
            [
                columns,
                effectiveColumnAlignments
            ]
        );
    const {
        visibleColumns: pmsVisibleColumns,
        setAlignment: setPmsColumnAlignment,
        setColumnStyle: setPmsColumnStyle
    } = columns;
    const applyGlobalPmsAlignment =
        useCallback(
            (value: PmsHorizontalAlignment) => {
                setGlobalPmsAlignment(value);
                for (const column of pmsVisibleColumns) {
                    setPmsColumnAlignment(
                        column.key,
                        value
                    );
                }
            },
            [
                pmsVisibleColumns,
                setPmsColumnAlignment
            ]
        );
    const [pmsFontFamily, setPmsFontFamily] =
        useState<PmsFontFamily>("Vazirmatn");
    const [pmsFontSize, setPmsFontSize] =
        useState(12);
    const [pmsFontBold, setPmsFontBold] =
        useState(false);
    const [pmsFontItalic, setPmsFontItalic] =
        useState(false);
    const [pmsFontColor, setPmsFontColor] =
        useState(colors.text);
    const [pmsDateFormat, setPmsDateFormat] =
        useState<PmsDateFormat>("YYYY-MM-DD");
    const applyPmsStyle =
        useCallback(
            (patch: Record<string, unknown>) => {
                for (const column of pmsVisibleColumns) {
                    setPmsColumnStyle(
                        column.key,
                        patch
                    );
                }
            },
            [
                pmsVisibleColumns,
                setPmsColumnStyle
            ]
        );
    const [
        rowHeight,
        setRowHeight
    ] = useState(
        ROW_HEIGHT
    );
    const [
        selectedId,
        setSelectedId
    ] = useState<string | null>(
        null
    );
    const [
        barStyle,
        setBarStyle
    ] = useState<
        | "flat"
        | "gradient"
        | "threeD"
        | "p6-2"
        | "p6-3"
        | "p6-4"
    >("p6-3");
    const [
        progressCalculation,
        setProgressCalculation
    ] = useState<ProgressCalculationType>(
        "weighted"
    );
    const [
        percentCompleteType,
        setPercentCompleteType
    ] = useState<
        | "Duration"
        | "Physical"
        | "Units"
        | "Weighted"
    >("Weighted");
    const [
        activityType,
        setActivityType
    ] = useState(
        "Task Dependent"
    );
    const [
        durationType,
        setDurationType
    ] = useState(
        "Fixed Duration"
    );
    const [
        calendars,
        setCalendars
    ] = useState(() => createDefaultCalendarRegistry());
    const [
        projectCalendarId,
        setProjectCalendarId
    ] = useState("standard-5-day");
    const [
        activityCalendarIds,
        setActivityCalendarIds
    ] = useState<Record<string, string | null>>(() => {
        try {
            const raw = window.localStorage.getItem(
                ACTIVITY_CALENDAR_STORAGE_KEY
            );
            if (!raw) return {};
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            return Object.fromEntries(
                Object.entries(parsed).filter(([, value]) =>
                    typeof value === "string" && value.trim().length > 0
                )
            ) as Record<string, string>;
        } catch {
            return {};
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(
                ACTIVITY_CALENDAR_STORAGE_KEY,
                JSON.stringify(activityCalendarIds)
            );
        } catch {
            // Browser storage can be unavailable; keep the in-memory calendar assignments.
        }
    }, [activityCalendarIds]);
    const [
        calendarManagerOpen,
        setCalendarManagerOpen
    ] = useState(false);
    const [
        relationshipEditorOpen,
        setRelationshipEditorOpen
    ] = useState(false);
    const [
        activityCode,
        setActivityCode
    ] = useState(
        "Activity ID"
    );
    const [
        schedulingMode,
        setSchedulingMode
    ] = useState<
        "CPM" | "Manual"
    >("CPM");
    const [scheduleRevision, setScheduleRevision] = useState(0);
    const [lastScheduledAt, setLastScheduledAt] = useState<Date | null>(null);
    const [
        responsible,
        setResponsible
    ] = useState(
        "Responsible"
    );
    const [
        primaryResource,
        setPrimaryResource
    ] = useState(
        "Primary Resource"
    );
    const [
        constraintType,
        setConstraintType
    ] = useState(
        "As Soon As Possible"
    );
    const scheduledRows =
        useMemo(
            () => {
                if (schedulingMode !== "CPM") {
                    return editableRows;
                }
                const adapted =
                    adaptGanttRowsToSchedule(
                        editableRows,
                        {
                            calendars: Object.fromEntries(
                                calendars.map(calendar => [calendar.id, calendar])
                            ),
                            defaultCalendarId: projectCalendarId,
                            activityCalendarIds
                        }
                    );
                const result =
                    scheduleProject(
                        adapted.activities,
                        Object.fromEntries(calendars.map(calendar => [calendar.id, calendar])),
                        buildScheduleOptions(
                            {
                                scheduleMode: "CPM",
                                dataDate: parseDate(
                                    statusDate
                                )
                            },
                            {
                                defaultCalendarId:
                                    projectCalendarId
                            }
                        )
                    );
                return applyScheduleResultToRows(
                    editableRows,
                    result
                );
            },
            [
                editableRows,
                schedulingMode,
                statusDate,
                calendars,
                projectCalendarId,
                activityCalendarIds
            ]
        );
    const displayRows = useMemo(
        () => buildGanttSummaryRows(
            scheduledRows,
            projectDuration,
            undefined
        ),
        [scheduledRows, projectDuration]
    );
    const tree =
        useGanttTree(
            displayRows
        );
    const [
        dayWidth,
        setDayWidth
    ] = useState(
        DEFAULT_DAY_WIDTH
    );
    const [
        timelineScale,
        setTimelineScale
    ] = useState<TimelineScale>(
        DEFAULT_TIMELINE_SCALE
    );
    const timeline =
        useGanttTimeline(
            displayRows,
            timelineScale,
            dayWidth,
            effectiveCustomColors
        );
    const parsedStatusDate =
        useMemo(
            () =>
                parseDate(
                    statusDate
                ),
            [statusDate]
        );
    const hasStatusDate =
        Boolean(
            parsedStatusDate
        );
    const [
        showDataDate,
        setShowDataDate
    ] = useState(true);
    const statusDateVisible =
        hasStatusDate &&
        showDataDate;
    const effectiveWbsCount =
        wbsCount ??
        displayRows.reduce((count, row) => count + countWbsRows(row), 0);
    const setColorPreset =
        useCallback(
            (
                preset: string
            ) => {
                if (
                    preset !==
                        "theme" &&
                    preset !==
                        "corporate" &&
                    preset !==
                        "engineering" &&
                    preset !==
                        "p6" &&
                    preset !==
                        "slate" &&
                    preset !==
                        "highContrast" &&
                    preset !==
                        "custom"
                ) {
                    return;
                }
                setColorSettings(
                    previous => ({
                        ...previous,
                        preset:
                            preset as
                            GanttColorPreset
                    })
                );
            },
            []
        );
    const customLegendItems: Array<{
        key: keyof GanttCustomColors;
        label: string;
    }> = [
        { key: "wbsLevel1", label: "WBS L1" },
        { key: "wbsLevel2", label: "WBS L2" },
        { key: "wbsLevel3", label: "WBS L3" },
        { key: "wbsLevel4", label: "WBS L4" },
        { key: "activity", label: "Activity" },
        { key: "critical", label: "Critical" },
        { key: "milestone", label: "Milestone" }
    ];

    const updateCustomColor =
        useCallback(
            (
                key: keyof GanttCustomColors,
                value: string
            ) => {
                setColorSettings(previous => ({
                    ...previous,
                    preset: "custom",
                    custom: {
                        ...previous.custom,
                        [key]: value
                    }
                }));
            },
            []
        );

    const resetColors =
        useCallback(() => {
            setColorSettings({
                preset: "theme",
                custom:
                    getDefaultCustomColors(
                        theme
                    )
            });
        }, [theme]);
    const handleProgressCalculation =
        useCallback(
            (value: string) => {
                if (
                    value ===
                        "duration" ||
                    value ===
                        "physical" ||
                    value ===
                        "units" ||
                    value ===
                        "weighted"
                ) {
                    setProgressCalculation(
                        value
                    );
                }
            },
            []
        );
    const handlePercentType =
        useCallback(
            (value: string) => {
                if (
                    value ===
                        "Duration" ||
                    value ===
                        "Physical" ||
                    value ===
                        "Units" ||
                    value ===
                        "Weighted"
                ) {
                    setPercentCompleteType(
                        value
                    );
                }
            },
            []
        );
    const handleSchedulingMode =
        useCallback(
            (value: string) => {
                if (
                    value ===
                        "CPM" ||
                    value ===
                        "Manual"
                ) {
                    setSchedulingMode(value);
                    setScheduleRevision(previous => previous + 1);
                    setLastScheduledAt(new Date());
                }
            },
            []
        );
    const runSchedule = useCallback(() => {
        setScheduleRevision(previous => previous + 1);
        setLastScheduledAt(new Date());
    }, []);
    useEffect(() => {
        const handleScheduleKey = (event: KeyboardEvent) => {
            if (event.key === "F9") {
                event.preventDefault();
                runSchedule();
            }
        };
        window.addEventListener("keydown", handleScheduleKey);
        return () => window.removeEventListener("keydown", handleScheduleKey);
    }, [runSchedule]);
    const leftScrollRef =
        useRef<HTMLDivElement | null>(
            null
        );
    const rightScrollRef =
        useRef<HTMLDivElement | null>(
            null
        );
    const scrollLockRef =
        useRef(false);
    const [
        viewportWidth,
        setViewportWidth
    ] = useState(0);
    useEffect(() => {
        const element =
            rightScrollRef.current;
        if (!element) {
            return;
        }
        const updateViewport =
            () => {
                setViewportWidth(
                    element.clientWidth
                );
            };
        updateViewport();
        if (
            typeof ResizeObserver !==
            "undefined"
        ) {
            const observer =
                new ResizeObserver(
                    updateViewport
                );
            observer.observe(
                element
            );
            return () =>
                observer.disconnect();
        }
        window.addEventListener(
            "resize",
            updateViewport
        );
        return () => {
            window.removeEventListener(
                "resize",
                updateViewport
            );
        };
    }, []);
    const syncVerticalScroll =
        useCallback(
            (
                source:
                    | "left"
                    | "right"
            ) => {
                if (
                    scrollLockRef.current
                ) {
                    return;
                }
                const left =
                    leftScrollRef.current;
                const right =
                    rightScrollRef.current;
                if (
                    !left ||
                    !right
                ) {
                    return;
                }
                scrollLockRef.current =
                    true;
                if (
                    source ===
                    "left"
                ) {
                    right.scrollTop =
                        left.scrollTop;
                } else {
                    left.scrollTop =
                        right.scrollTop;
                }
                requestAnimationFrame(
                    () => {
                        scrollLockRef.current =
                            false;
                    }
                );
            },
            []
        );
    const handleLeftScroll =
        useCallback(() => {
            syncVerticalScroll(
                "left"
            );
        }, [
            syncVerticalScroll
        ]);
    const handleRightScroll =
        useCallback(() => {
            syncVerticalScroll(
                "right"
            );
        }, [
            syncVerticalScroll
        ]);
    const updateRow =
        useCallback(
            (
                id: string,
                patch: Partial<ApiGanttRow>
            ) => {
                setEditableRows(
                    previous => {
                        const update =
                            (
                                items:
                                    ApiGanttRow[]
                            ): ApiGanttRow[] =>
                                items.map(
                                    item => {
                                        if (
                                            item.id ===
                                            id
                                        ) {
                                            onRowUpdate?.(
                                                id,
                                                patch
                                            );
                                            return {
                                                ...item,
                                                ...patch
                                            };
                                        }
                                        if (
                                            item.children
                                                ?.length
                                        ) {
                                            return {
                                                ...item,
                                                children:
                                                    update(
                                                        item.children
                                                    )
                                            };
                                        }
                                        return item;
                                    }
                                );
                        return update(
                            previous
                        );
                    }
                );
                runSchedule();
            },
            [onRowUpdate, runSchedule]
        );
    const addActivity = useCallback(() => {
        setEditableRows(previous => {
            const selected = selectedId
                ? (() => {
                    const find = (items: ApiGanttRow[]): ApiGanttRow | null => {
                        for (const item of items) {
                            if (item.id === selectedId) return item;
                            if (item.children?.length) {
                                const found = find(item.children);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    return find(previous);
                })()
                : null;

            const siblings = selected
                ? (() => {
                    const findChildren = (items: ApiGanttRow[]): ApiGanttRow[] | null => {
                        for (const item of items) {
                            if (item.children?.some(child => child.id === selected.id)) return item.children;
                            if (item.children?.length) {
                                const found = findChildren(item.children);
                                if (found) return found;
                            }
                        }
                        return null;
                    };
                    return findChildren(previous) ?? previous;
                })()
                : previous;

            const activityNumbers = siblings
                .map(item => String(item.code ?? "").match(/(\d+)$/)?.[1])
                .filter(Boolean)
                .map(value => Number(value));
            const nextNumber = Math.max(0, ...activityNumbers) + 1;
            const base = selected ?? siblings.find(item => item.type === "activity");
            const newActivity = {
                ...(base ?? {}),
                id: `ACT-${String(nextNumber).padStart(3, "0")}`,
                code: `A${String(nextNumber).padStart(3, "0")}`,
                name: "New Activity",
                type: "activity",
                children: [],
                predecessors: [],
                successors: [],
                duration: 1,
                remainingDuration: 1,
                actualProgress: 0,
                plannedProgress: 0,
                isCritical: false,
                isMilestone: false
            } as unknown as ApiGanttRow;

            if (selected) {
                const appendSibling = (items: ApiGanttRow[]): ApiGanttRow[] => items.map(item => {
                    if (item.children?.some(child => child.id === selected.id)) {
                        return { ...item, children: [...item.children, newActivity] };
                    }
                    if (item.children?.length) return { ...item, children: appendSibling(item.children) };
                    return item;
                });
                return appendSibling(previous);
            }
            return [...previous, newActivity];
        });
    }, [selectedId]);

    const selectedActivity = useMemo(() => {
        if (!selectedId) return null;
        const find = (items: ApiGanttRow[]): ApiGanttRow | null => {
            for (const item of items) {
                if (item.id === selectedId) return item;
                if (item.children?.length) {
                    const found = find(item.children);
                    if (found) return found;
                }
            }
            return null;
        };
        const found = find(editableRows);
        return found?.type === "activity" ? found : null;
    }, [editableRows, selectedId]);

    const removeActivity = useCallback(() => {
        if (!selectedActivity) return;
        const remove = (items: ApiGanttRow[]): ApiGanttRow[] => items
            .filter(item => item.id !== selectedActivity.id)
            .map(item => item.children?.length ? { ...item, children: remove(item.children) } : item);
        setEditableRows(remove);
        setSelectedId(null);
    }, [selectedActivity]);

    const handleProjectCalendarChange = useCallback(
        (value: string) => {
            setProjectCalendarId(value);
            runSchedule();
        },
        [runSchedule]
    );

    const selectedActivityCalendarId = selectedActivity
        ? activityCalendarIds[selectedActivity.id] ?? projectCalendarId
        : projectCalendarId;
    const handleActivityCalendarChange = useCallback(
        (calendarId: string) => {
            if (!selectedActivity) return;
            setActivityCalendarIds(previous => {
                const next = { ...previous };
                if (calendarId === "__inherit__") {
                    delete next[selectedActivity.id];
                } else if (calendarId) {
                    next[selectedActivity.id] = calendarId;
                }
                return next;
            });
            runSchedule();
        },
        [selectedActivity, runSchedule]
    );
    const handleRelationshipSave = useCallback(
        async (
            rowId: string,
            predecessors: NonNullable<ApiGanttRow["predecessors"]>
        ) => {
            if (!onSaveRelationships) {
                throw new Error("Relationship persistence is not configured.");
            }

            await onSaveRelationships(rowId, predecessors);
        },
        [onSaveRelationships]
    );
    const zoomIn =
        useCallback(() => {
            setDayWidth(
                value =>
                    clamp(
                        value + 4,
                        MIN_DAY_WIDTH,
                        MAX_DAY_WIDTH
                    )
            );
        }, []);
    const zoomOut =
        useCallback(() => {
            setDayWidth(
                value =>
                    clamp(
                        value - 4,
                        MIN_DAY_WIDTH,
                        MAX_DAY_WIDTH
                    )
            );
        }, []);
    const fitTimeline =
        useCallback(() => {
            if (
                !viewportWidth ||
                !timeline.rangeDays
            ) {
                return;
            }
            setDayWidth(
                clamp(
                    viewportWidth /
                        timeline.rangeDays,
                    MIN_DAY_WIDTH,
                    MAX_DAY_WIDTH
                )
            );
            const right =
                rightScrollRef.current;
            if (right) {
                right.scrollLeft = 0;
            }
        }, [
            viewportWidth,
            timeline.rangeDays
        ]);
    const sharedRowProps = {
        colors,
        columns,
        rowHeight,
        selected: false,
        onSelect:
            setSelectedId,
        onUpdate:
            updateRow,
        columnStyles:
            effectiveColumns.columnStyles,
        expandedIds:
            tree.expandedIds,
        toggleRow:
            tree.toggleRow,
        fontFamily:
            pmsFontFamily,
        fontSize:
            pmsFontSize,
        fontWeight:
            pmsFontBold ? 700 : 400,
        fontItalic:
            pmsFontItalic,
        fontColor:
            pmsFontColor,
        verticalAlignment:
            "center" as const,
        dateFormat:
            pmsDateFormat,
        progressCalculation,
        percentCompleteType,
        showDataDate
    };
    const [customLegendOpen, setCustomLegendOpen] = useState(false);
    const [customColorEditorOpen, setCustomColorEditorOpen] = useState(false);
    const [pmsTableOpen, setPmsTableOpen] = useState(true);
    const [panelsMenuOpen, setPanelsMenuOpen] = useState(false);
    const [programSettingsOpen, setProgramSettingsOpen] = useState(false);
    const [visualSettingsOpen, setVisualSettingsOpen] = useState(false);
    const [pmsStyleSettingsOpen, setPmsStyleSettingsOpen] = useState(false);
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                minHeight: 640,
                display: "flex",
                flexDirection:
                    "column",
                overflow: "hidden",
                backgroundColor:
                    colors.background,
                color:
                    colors.text,
                fontFamily:
                    DEFAULT_DISPLAY_FONT_FAMILY
            }}
        >
            {/* ================================================= */}
            <Box
                sx={{
                    position: "relative",
                    flexShrink: 0,
                    width: "100%",
                    height: 40,
                    minHeight: 40,
                    display: "flex",
                    alignItems: "stretch",
                    overflow: "visible",
                    backgroundColor: colors.surface,
                    borderBottom: `1px solid ${colors.border}`,
                    boxShadow: "0 1px 3px rgba(15,23,42,.05)",
                    direction: "rtl"
                }}
            >
                <Box
                    sx={{
                        flex: "0 0 auto",
                        minWidth: 0,
                        height: 40,
                        minHeight: 40,
                        overflow: "hidden",
                        borderLeft: `1px solid ${colors.border}`,
                        "& > .MuiBox-root": {
                            height: "100% !important",
                            minHeight: "100% !important",
                            backgroundColor: "transparent !important",
                            borderBottom: "0 !important",
                            boxShadow: "none !important"
                        },
                        "& > .MuiBox-root > .MuiBox-root:first-of-type": {
                            display: "none !important"
                        }
                    }}
                >
                    <GanttToolbar
                        colors={colors}
                        effectiveWbsCount={effectiveWbsCount}
                        scheduleRange={timeline.scheduleRange}
                        statusDateVisible={statusDateVisible}
                        timelineScale={timelineScale}
                        setTimelineScale={setTimelineScale}
                        allWbsIds={tree.allWbsIds}
                        expansionLevel={tree.expansionLevel}
                        maxWbsLevel={tree.maxWbsLevel}
                        expandAll={tree.expandAll}
                        collapseAll={tree.collapseAll}
                        expandToLevel={tree.expandToLevel}
                        dayWidth={dayWidth}
                        zoomIn={zoomIn}
                        zoomOut={zoomOut}
                        fitTimeline={fitTimeline}
                        columnsOpen={Boolean(columns.anchor)}
                        setColumnsAnchor={columns.setAnchor}
                    />
                </Box>

                <Box
                    sx={{
                        height: 40,
                        minHeight: 40,
                        px: 0.7,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.45,
                        borderLeft: `1px solid ${colors.border}`,
                        backgroundColor: colors.surface,
                        direction: "ltr",
                        whiteSpace: "nowrap"
                    }}
                >
                    <Typography sx={{ fontSize: 7.8, fontWeight: 900, color: colors.primary, letterSpacing: 0.45 }}>PROJECT CONTROLS</Typography>
                    <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: schedulingMode === "CPM" ? colors.success : colors.warning }} />
                    <Typography sx={{ fontSize: 7.1, color: colors.muted }}>{schedulingMode === "CPM" ? "CPM" : "MANUAL"}</Typography>
                </Box>

                <Box
                    sx={{
                        position: "relative",
                        flex: "0 0 auto",
                        width: 74,
                        minWidth: 74,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderLeft: `1px solid ${colors.border}`,
                        backgroundColor: colors.surface
                    }}
                >
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={panelsMenuOpen}
                        onClick={() => setPanelsMenuOpen(value => !value)}
                        style={{
                            height: 26,
                            minWidth: 62,
                            border: `1px solid ${panelsMenuOpen ? alpha(colors.primary, 0.42) : colors.border}`,
                            background: panelsMenuOpen ? alpha(colors.primary, 0.08) : colors.background,
                            color: panelsMenuOpen ? colors.primary : colors.muted,
                            borderRadius: 6,
                            padding: "0 8px",
                            fontFamily: "Vazirmatn",
                            fontSize: 7.2,
                            fontWeight: 900,
                            letterSpacing: 0.35,
                            cursor: "pointer",
                            boxShadow: panelsMenuOpen ? `0 1px 4px ${alpha(colors.primary, 0.12)}` : "none"
                        }}
                    >
                        PANELS
                    </button>

                    {panelsMenuOpen && (
                        <Box
                            role="menu"
                            sx={{
                                position: "absolute",
                                top: 43,
                                right: 4,
                                zIndex: 80,
                                width: 184,
                                p: 0.6,
                                display: "grid",
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                gap: 0.45,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 1,
                                backgroundColor: colors.paper,
                                boxShadow: "0 10px 30px rgba(15,23,42,.16)"
                            }}
                        >
                            <Typography
                                sx={{
                                    gridColumn: "1 / -1",
                                    px: 0.35,
                                    pt: 0.1,
                                    fontSize: 7,
                                    fontWeight: 900,
                                    letterSpacing: 0.4,
                                    color: colors.muted
                                }}
                            >
                                PANEL VISIBILITY
                            </Typography>

                            <button
                                type="button"
                                onClick={() => {
                                    setPmsTableOpen(true);
                                    setVisualSettingsOpen(true);
                                    setPmsStyleSettingsOpen(true);
                                    setProgramSettingsOpen(true);
                                }}
                                style={{
                                    height: 24,
                                    border: `1px solid ${alpha(colors.primary, 0.24)}`,
                                    background: alpha(colors.primary, 0.055),
                                    color: colors.primary,
                                    borderRadius: 5,
                                    fontFamily: "Vazirmatn",
                                    fontSize: 6.8,
                                    fontWeight: 900,
                                    cursor: "pointer"
                                }}
                            >
                                ALL
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPmsTableOpen(false);
                                    setVisualSettingsOpen(false);
                                    setPmsStyleSettingsOpen(false);
                                    setProgramSettingsOpen(false);
                                }}
                                style={{
                                    height: 24,
                                    border: `1px solid ${colors.border}`,
                                    background: colors.background,
                                    color: colors.muted,
                                    borderRadius: 5,
                                    fontFamily: "Vazirmatn",
                                    fontSize: 6.8,
                                    fontWeight: 900,
                                    cursor: "pointer"
                                }}
                            >
                                MINIMIZE
                            </button>

                            {[
                                ["PMS", pmsTableOpen, () => setPmsTableOpen(value => !value)],
                                ["VISUAL", visualSettingsOpen, () => setVisualSettingsOpen(value => !value)],
                                ["PMS STYLE", pmsStyleSettingsOpen, () => setPmsStyleSettingsOpen(value => !value)],
                                ["PROGRAM", programSettingsOpen, () => setProgramSettingsOpen(value => !value)]
                            ].map(([label, open, toggle]) => (
                                <button
                                    key={label as string}
                                    type="button"
                                    role="menuitemcheckbox"
                                    aria-checked={Boolean(open)}
                                    onClick={toggle as () => void}
                                    style={{
                                        height: 24,
                                        border: `1px solid ${open ? alpha(colors.primary, 0.34) : colors.border}`,
                                        background: open ? alpha(colors.primary, 0.07) : colors.background,
                                        color: open ? colors.primary : colors.muted,
                                        borderRadius: 5,
                                        padding: "0 6px",
                                        fontFamily: "Vazirmatn",
                                        fontSize: 6.8,
                                        fontWeight: 900,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                >
                                    {(open ? "● " : "○ ") + (label as string)}
                                </button>
                            ))}
                        </Box>
                    )}
                </Box>
            </Box>
            <GanttColumnsPopover
                open={Boolean(columns.anchor)}
                anchorEl={columns.anchor}
                onClose={columns.close}
                colors={colors}
                visibleColumns={columns.visibleColumns}
                visibleColumnKeys={columns.visibleColumnKeys}
                isColumnVisible={columns.isVisible}
                toggleColumn={column => columns.toggle(column.key)}
                resetColumns={columns.reset}
            />
            {/* ================================================= */}
            <Box
                sx={{
                    flex: "1 1 0",
                    minHeight: 0,
                    display: "flex",
                    flexDirection:
                        "column",
                    overflow: "hidden",
                    mx: 0.5,
                    mb: 0.5,
                    position: "relative",
                    backgroundColor:
                        colors.paper,
                    border:
                        `1px solid ${colors.border}`,
                    borderRadius: 1,
                    boxShadow:
                        theme.palette.mode ===
                        "dark"
                            ? "none"
                            : "0 1px 4px rgba(15,23,42,.07)"
                }}
            >
                {/* ============================================= */}
                <Box
                    sx={{
                        flex: "1 1 0",
                        minWidth: 0,
                        minHeight: 0,
                        display: "flex",
                        gap: `${PMS_GANTT_GAP}px`,
                        overflowX: "auto",
                        overflowY: "hidden",
                        flexBasis: 0,
                        backgroundColor:
                            colors.paper,
                        px: 0.5,
                        pb: 0.5,
                        boxSizing: "border-box"
                    }}
                >
                    {/* ========================================= */}
                    <Box
                        ref={
                            leftScrollRef
                        }
                        onScroll={
                            handleLeftScroll
                        }
                        sx={{
                            flex: `0 0 ${columns.labelWidth}px`,
                            width:
                                columns.labelWidth,
                            minWidth:
                                columns.labelWidth,
                            maxWidth:
                                columns.labelWidth,
                            height:
                                "100%",
                            minHeight: 0,
                            overflowY:
                                "auto",
                            overflowX:
                                "hidden",
                            scrollbarWidth:
                                "none",
                            "&::-webkit-scrollbar":
                                {
                                    width: 0,
                                    height: 0
                                },
                            backgroundColor:
                                colors.paper,
                            border:
                                PMS_GANTT_BORDER,
                            boxSizing:
                                "border-box",
                            position:
                                "relative",
                            zIndex: 5,
                            display: pmsTableOpen ? "block" : "none"
                        }}
                    >
                        <Box
                            sx={{
                                position:
                                    "sticky",
                                top: 0,
                                zIndex: 12,
                                backgroundColor:
                                    colors.header,
                                borderBottom:
                                    `1px solid ${colors.border}`
                            }}
                        >
                            <GanttHeader
                                colors={
                                    colors
                                }
                                columns={
                                    columns.visibleColumns
                                }
                                columnWidths={
                                    columns.columnWidths
                                }
                                alignments={
                                    effectiveColumnAlignments
                                }
                                fontFamily={pmsFontFamily}
                                fontSize={pmsFontSize}
                                fontItalic={pmsFontItalic}
                                onResize={
                                    columns.resize
                                }
                            />
                        </Box>
                        {tree.visibleRows.map(
                            (
                                row:
                                    ApiGanttRow,
                                index
                            ) => (
                                <GanttRow
                                    key={
                                        row.id
                                    }
                                    {...sharedRowProps}
                                    row={
                                        row
                                    }
                                    index={
                                        index
                                    }
                                    side="pms"
                                    selected={
                                        selectedId ===
                                        row.id
                                    }
                                    customColors={
                                        effectiveCustomColors
                                    }
                                    timelineGridStep={
                                        dayWidth
                                    }
                                />
                            )
                        )}
                    </Box>
                    {/* ========================================= */}
                    <Box
                        ref={
                            rightScrollRef
                        }
                        onScroll={
                            handleRightScroll
                        }
                        sx={{
                            flex: pmsTableOpen ? "1 0 520px" : "1 1 100%",
                            width: pmsTableOpen ? "520px" : "100%",
                            minWidth: pmsTableOpen ? 520 : 0,
                            minHeight: 0,
                            height:
                                "100%",
                            overflowX:
                                "auto",
                            overflowY:
                                "auto",
                            position:
                                "relative",
                            backgroundColor:
                                colors.paper,
                            border:
                                PMS_GANTT_BORDER,
                            boxSizing:
                                "border-box",
                            overscrollBehavior:
                                "contain"
                        }}
                    >
                        <Box
                            sx={{
                                position:
                                    "sticky",
                                top: 0,
                                zIndex: 12,
                                width:
                                    timeline.timelineWidth,
                                minWidth:
                                    timeline.timelineWidth,
                                backgroundColor:
                                    colors.header,
                                borderBottom:
                                    `1px solid ${colors.border}`
                            }}
                        >
                            <GanttTimelineHeader
                                colors={
                                    colors
                                }
                                width={
                                    timeline.timelineWidth
                                }
                                units={
                                    timeline.timelineUnits
                                }
                                dayWidth={
                                    dayWidth
                                }
                                dateToX={
                                    timeline.dateToX
                                }
                                widthBetweenDates={
                                    timeline.widthBetweenDates
                                }
                                fontFamily={pmsFontFamily}
                                fontSize={pmsFontSize}
                                fontItalic={pmsFontItalic}
                                statusDate={
                                    parsedStatusDate
                                }
                                statusDateVisible={
                                    statusDateVisible
                                }
                            />
                        </Box>
                        <Box
                            sx={{
                                position: "relative",
                                width: Math.max(timeline.timelineWidth, viewportWidth, 1),
                                minWidth: Math.max(timeline.timelineWidth, viewportWidth, 1),
                                height: tree.visibleRows.length * rowHeight,
                                minHeight: tree.visibleRows.length * rowHeight
                            }}
                        >
                            <GanttRelationshipLayer
                                rows={tree.visibleRows}
                                timelineWidth={Math.max(timeline.timelineWidth, viewportWidth, 1)}
                                rowHeight={rowHeight}
                                dateToX={timeline.dateToX}
                                selectedActivityId={selectedId}
                                color={alpha(colors.muted, 0.72)}
                                highlightColor={colors.primary}
                            />
                            {tree.visibleRows.map(
                                (
                                    row: ApiGanttRow,
                                    index
                                ) => (
                                    <GanttRow
                                        key={row.id}
                                        {...sharedRowProps}
                                        row={row}
                                        index={index}
                                        side="timeline"
                                        selected={selectedId === row.id}
                                        timelineWidth={Math.max(timeline.timelineWidth, viewportWidth, 1)}
                                        dateToX={timeline.dateToX}
                                        widthBetweenDates={timeline.widthBetweenDates}
                                        timelineGridStep={dayWidth}
                                        barStyle={barStyle}
                                        customColors={effectiveCustomColors}
                                        getWbsColor={timeline.getWbsColor}
                                        statusDate={parsedStatusDate}
                                        statusDateVisible={statusDateVisible}
                                    />
                                )
                            )}
                        </Box>
                    </Box>
                </Box>
                {/* ============================================= */}
                <Box sx={{
                    flex: (visualSettingsOpen || pmsStyleSettingsOpen || programSettingsOpen) ? `0 0 ${SETTINGS_PANEL_HEIGHT}px` : "0 0 0px",
                    height: (visualSettingsOpen || pmsStyleSettingsOpen || programSettingsOpen) ? SETTINGS_PANEL_HEIGHT : 0,
                    minHeight: 0,
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: visualSettingsOpen && pmsStyleSettingsOpen ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)",
                    gridTemplateRows: programSettingsOpen && (visualSettingsOpen || pmsStyleSettingsOpen) ? "minmax(0, 1fr) minmax(0, 1fr)" : "minmax(0, 1fr)",
                    gap: (visualSettingsOpen || pmsStyleSettingsOpen || programSettingsOpen) ? 0.6 : 0,
                    px: 0.55,
                    pb: 0.55,
                    boxSizing: "border-box",
                    backgroundColor: colors.background,
                    overflow: "hidden"
                }}>
                    <PmsSettingsSection
                        title="VISUAL SETTINGS"
                        colors={colors}
                        open={visualSettingsOpen}
                        visible={visualSettingsOpen}
                        onToggle={() => setVisualSettingsOpen(value => !value)}
                    >
                        <Box sx={{
                            height: "100%",
                            minHeight: 0,
                            overflowY: "auto",
                            overflowX: "hidden",
                            pr: 0.15
                        }}>

                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: 0.35, alignItems: "start" }}>
                        <SettingsSelectRow
                            label="Color Theme"
                            value={colorSettings.preset}
                            colors={colors}
                            options={[
                                ["theme", "Theme"],
                                ["corporate", "Corporate"],
                                ["engineering", "Engineering"],
                                ["p6", "P6"],
                                ["slate", "Slate"],
                                ["highContrast", "High Contrast"],
                                ["custom", "Custom"]
                            ]}
                            onChange={setColorPreset}
                        />
                        <SettingsSelectRow
                            label="Bar Layout"
                            value={barStyle}
                            colors={colors}
                            options={[
                                ["p6-2", "2 Layers • Plan / Actual"],
                                ["p6-3", "3 Layers • Plan / Actual / Progress"],
                                ["p6-4", "4 Layers • Plan / Actual / Progress / Status"],
                                ["flat", "Single Flat Bar"],
                                ["gradient", "Single Gradient Bar"],
                                ["threeD", "Single 3D Bar"]
                            ]}
                            onChange={value => setBarStyle(value as typeof barStyle)}
                        />
                        <SettingsSelectRow
                            label="Data Date Line"
                            value={showDataDate ? "on" : "off"}
                            colors={colors}
                            options={[["on", "Visible"], ["off", "Hidden"]]}
                            onChange={value => setShowDataDate(value === "on")}
                        />
                        <Box sx={{ px: 0.8, py: 0.25, display: "grid", gridTemplateColumns: "minmax(0, 1fr) 130px", alignItems: "center", gap: 1, direction: "ltr" }}>
                            <Typography sx={{ fontSize: 8.5, fontWeight: 700, color: colors.muted }}>Row Height</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                                <Slider size="small" min={MIN_ROW_HEIGHT} max={MAX_ROW_HEIGHT} value={rowHeight} onChange={(_, value) => setRowHeight(Number(value))} sx={{ color: colors.primary, flex: 1 }} />
                                <Typography sx={{ width: 25, textAlign: "right", fontSize: 7.6, fontWeight: 800, color: colors.primary }}>{rowHeight}</Typography>
                            </Box>
                        </Box>
                        {colorSettings.preset === "custom" && (
                            <Box sx={{ px: 0.6, py: 0.15, display: "flex", justifyContent: "flex-end" }}>
                                <button type="button" onClick={() => setCustomLegendOpen(v => !v)} style={{ border: `1px solid ${colors.border}`, background: colors.surface, color: colors.primary, borderRadius: 4, padding: "3px 8px", fontFamily: "Vazirmatn", fontSize: 8, fontWeight: 800, cursor: "pointer" }}>
                                    {customLegendOpen ? "Hide Legend" : "Legend"}
                                </button>
                            </Box>
                        )}
                        {colorSettings.preset === "custom" && (
    <Box sx={{ gridColumn: "1 / -1", px: 0.8, py: 0.35 }}>
        <button
            type="button"
            onClick={() => setCustomColorEditorOpen(value => !value)}
            style={{
                border: `1px solid ${alpha(colors.primary, 0.28)}`,
                background: alpha(colors.primary, 0.06),
                color: colors.primary,
                borderRadius: 5,
                padding: "3px 8px",
                fontFamily: "Vazirmatn",
                fontSize: 8.5,
                fontWeight: 700,
                cursor: "pointer"
            }}
        >
            {customColorEditorOpen ? "Hide Color Settings" : "Custom Colors"}
        </button>
        {customColorEditorOpen && (
            <Box sx={{
                mt: 0.5,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
                gap: 0.45,
                p: 0.55,
                border: `1px solid ${colors.border}`,
                borderRadius: 1,
                background: colors.surface
            }}>
                {customLegendItems.map(item => (
                    <Box key={item.key} sx={{ display: "flex", alignItems: "center", gap: 0.45 }}>
                        <input
                            type="color"
                            value={effectiveCustomColors[item.key]}
                            onChange={event => updateCustomColor(item.key, event.target.value)}
                            style={{ width: 22, height: 18, padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
                            aria-label={item.label}
                        />
                        <Typography sx={{ fontSize: 8, color: colors.text, whiteSpace: "nowrap" }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        )}
    </Box>
)}

{colorSettings.preset === "custom" && customLegendOpen && (
                            <Box sx={{ px: 0.6, py: 0.15, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 0.3, direction: "ltr" }}>
                                {(Object.keys(effectiveCustomColors) as Array<keyof GanttCustomColors>).map(key => (
                                    <Box key={key} sx={{ minWidth: 0, height: 21, display: "flex", alignItems: "center", gap: 0.25, px: 0.3, border: `1px solid ${colors.border}`, borderRadius: 0.55, backgroundColor: alpha(effectiveCustomColors[key], 0.12) }}>
                                        <Box sx={{ width: 12, height: 12, flexShrink: 0, borderRadius: 0.35, backgroundColor: effectiveCustomColors[key] }} />
                                        <Typography noWrap sx={{ minWidth: 0, fontSize: 6.8, fontWeight: 700, color: colors.muted, overflow: "hidden", textOverflow: "ellipsis" }}>{key.replace("wbsLevel", "WBS L")}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <Box sx={{ px: 0.8, py: 0.25, display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                            <button type="button" onClick={resetColors} style={{ border: `1px solid ${colors.border}`, background: colors.surface, color: colors.muted, borderRadius: 5, padding: "4px 9px", fontFamily: "Vazirmatn", fontSize: 7.6, fontWeight: 700, cursor: "pointer" }}>Reset colors</button>
                            <button type="button" onClick={columns.resetWidths} style={{ border: `1px solid ${colors.border}`, background: colors.surface, color: colors.primary, borderRadius: 5, padding: "4px 9px", fontFamily: "Vazirmatn", fontSize: 7.6, fontWeight: 700, cursor: "pointer" }}>Reset column widths</button>
                        </Box>
                        </Box>
                        </Box>
                    </PmsSettingsSection>
                    <PmsSettingsSection
                        title="PMS STYLE"
                        colors={colors}
                        open={pmsStyleSettingsOpen}
                        visible={pmsStyleSettingsOpen}
                        onToggle={() => setPmsStyleSettingsOpen(value => !value)}
                    >
                        <PmsFormatToolbar
                            colors={colors}
                            globalAlignment={globalPmsAlignment}
                            setGlobalAlignment={applyGlobalPmsAlignment}
                            fontFamily={pmsFontFamily}
                            setFontFamily={setPmsFontFamily}
                            fontSize={pmsFontSize}
                            setFontSize={setPmsFontSize}
                            bold={pmsFontBold}
                            setBold={setPmsFontBold}
                            italic={pmsFontItalic}
                            setItalic={setPmsFontItalic}
                            fontColor={pmsFontColor}
                            setFontColor={setPmsFontColor}
                            dateFormat={pmsDateFormat}
                            setDateFormat={setPmsDateFormat}
                            onApplyStyle={patch => applyPmsStyle(patch)}
                        />
                    </PmsSettingsSection>

                    <Box sx={{
                        gridColumn: "1 / -1",
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden"
                    }}>
                    <PmsSettingsSection
                        title="PROGRAM SETTINGS"
                        colors={colors}
                        open={programSettingsOpen}
                        visible={programSettingsOpen}
                        onToggle={() => setProgramSettingsOpen(value => !value)}
                    >
                        <Box sx={{
                            height: "100%",
                            minHeight: 0,
                            overflowY: "auto",
                            overflowX: "hidden"
                        }}>
                        <Box sx={{ px: 0.8, py: 0.45, display: "flex", alignItems: "center", gap: 0.45, borderBottom: `1px solid ${colors.border}` }}>
                            <Typography sx={{ fontSize: 7.8, fontWeight: 800, color: colors.muted, mr: 0.35 }}>ACTIVITIES</Typography>
                            <button type="button" onClick={addActivity} style={{ border: `1px solid ${alpha(colors.primary, 0.30)}`, background: alpha(colors.primary, 0.07), color: colors.primary, borderRadius: 4, padding: "3px 8px", fontFamily: "Vazirmatn", fontSize: 7.8, fontWeight: 800, cursor: "pointer" }}>+ Activity</button>
                            <button type="button" onClick={removeActivity} disabled={!selectedActivity} style={{ border: `1px solid ${colors.border}`, background: colors.surface, color: selectedActivity ? colors.error : colors.muted, borderRadius: 4, padding: "3px 8px", fontFamily: "Vazirmatn", fontSize: 7.8, fontWeight: 800, cursor: selectedActivity ? "pointer" : "not-allowed", opacity: selectedActivity ? 1 : 0.55 }}>− Activity</button>
                            <button type="button" onClick={runSchedule} style={{ border: `1px solid ${alpha(colors.primary, 0.34)}`, background: alpha(colors.primary, 0.08), color: colors.primary, borderRadius: 4, padding: "3px 9px", fontFamily: "Vazirmatn", fontSize: 7.8, fontWeight: 900, cursor: "pointer" }}>Schedule • F9</button>
                            <Typography noWrap sx={{ ml: "auto", minWidth: 0, fontSize: 7.2, color: colors.muted }}>
                                {selectedActivity ? `${selectedActivity.code ?? selectedActivity.id} • selected` : "Select an activity to remove"}
                            </Typography>
                        </Box>
                        <Box sx={{ px: 0.8, py: 0.3, display: "flex", alignItems: "center", gap: 0.6, borderBottom: `1px solid ${colors.border}`, backgroundColor: alpha(colors.primary, 0.025) }}>
                            <Typography sx={{ fontSize: 7.2, fontWeight: 900, color: colors.primary, letterSpacing: 0.2 }}>
                                {schedulingMode === "CPM" ? "CPM SCHEDULE" : "MANUAL SCHEDULE"}
                            </Typography>
                            <Typography sx={{ fontSize: 7, color: colors.muted }}>
                                {schedulingMode === "CPM" ? "Edit driving fields → recalculate" : "Manual mode • no CPM propagation"}
                            </Typography>
                            <Typography noWrap sx={{ ml: "auto", fontSize: 6.8, color: colors.muted }}>
                                {lastScheduledAt ? `Last schedule ${lastScheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : "Not scheduled yet"}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", columnGap: 0.35, alignContent: "start" }}>
                            <SettingsSelectRow label="Activity Type" value={activityType} colors={colors} options={[["Task Dependent", "Task Dependent"], ["Resource Dependent", "Resource Dependent"], ["Level of Effort", "Level of Effort"], ["Start Milestone", "Start Milestone"], ["Finish Milestone", "Finish Milestone"]]} onChange={setActivityType} />
                            <SettingsSelectRow label="Duration Type" value={durationType} colors={colors} options={[["Fixed Duration", "Fixed Duration"], ["Fixed Units/Time", "Fixed Units/Time"], ["Fixed Units", "Fixed Units"]]} onChange={setDurationType} />
                            <SettingsSelectRow
                                label="Project Calendar"
                                value={projectCalendarId}
                                colors={colors}
                                options={calendars.map(item => [item.id, item.name] as [string, string])}
                                onChange={handleProjectCalendarChange}
                            />
                            <SettingsSelectRow
                                label="Activity Calendar"
                                value={selectedActivity ? (activityCalendarIds[selectedActivity.id] ?? "__inherit__") : "__inherit__"}
                                colors={colors}
                                options={[
                                    ["__inherit__", `Inherit • ${calendars.find(item => item.id === projectCalendarId)?.name ?? "Project Calendar"}`],
                                    ...calendars.map(item => [item.id, item.name] as [string, string])
                                ]}
                                onChange={handleActivityCalendarChange}
                                disabled={!selectedActivity}
                            />
                            <Box sx={{ gridColumn: "1 / -1", px: 0.8, py: 0.35, display: "flex", alignItems: "center", gap: 0.7, borderTop: `1px solid ${colors.border}`, mt: 0.2, pt: 0.6 }}>
                                <Typography sx={{ flex: 1, fontSize: 7.4, color: colors.muted }}>
                                    {selectedActivity
                                        ? `${calendars.find(item => item.id === selectedActivityCalendarId)?.name ?? "Project Calendar"} • ${selectedActivity.code} calendar`
                                        : `${calendars.find(item => item.id === projectCalendarId)?.name ?? "Project Calendar"} • Activity calendars inherit this by default`}
                                </Typography>
                                <button
                                    type="button"
                                    onClick={() => setCalendarManagerOpen(true)}
                                    style={{ border: `1px solid ${alpha(colors.primary, 0.28)}`, background: alpha(colors.primary, 0.06), color: colors.primary, borderRadius: 5, padding: "4px 9px", fontFamily: "Vazirmatn", fontSize: 7.6, fontWeight: 800, cursor: "pointer" }}
                                >
                                    Manage Calendars
                                </button>
                            </Box>
                            <Box sx={{ gridColumn: "1 / -1", px: 0.8, py: 0.35, display: "flex", alignItems: "center", gap: 0.7, borderTop: `1px solid ${colors.border}`, mt: 0.2, pt: 0.6 }}>
                                <Typography sx={{ flex: 1, fontSize: 7.4, color: colors.muted }}>
                                    {selectedActivity ? `${selectedActivity.code} • ${selectedActivity.name}` : "Select an activity in the Gantt to edit its relationships"}
                                </Typography>
                                <button
                                    type="button"
                                    disabled={!selectedActivity}
                                    onClick={() => setRelationshipEditorOpen(true)}
                                    style={{ border: `1px solid ${alpha(colors.primary, 0.28)}`, background: selectedActivity ? alpha(colors.primary, 0.06) : colors.surface, color: selectedActivity ? colors.primary : colors.muted, borderRadius: 5, padding: "4px 9px", fontFamily: "Vazirmatn", fontSize: 7.6, fontWeight: 800, cursor: selectedActivity ? "pointer" : "not-allowed" }}
                                >
                                    Relationships
                                </button>
                            </Box>
                            <SettingsSelectRow label="Activity Code" value={activityCode} colors={colors} options={[["Activity ID", "Activity ID"], ["WBS Code", "WBS Code"], ["Activity Code", "Activity Code"]]} onChange={setActivityCode} />
                            <SettingsSelectRow label="Scheduling Mode" value={schedulingMode} colors={colors} options={[["CPM", "CPM"], ["Manual", "Manual"]]} onChange={handleSchedulingMode} />
                            <SettingsSelectRow label="Constraint Type" value={constraintType} colors={colors} options={[["As Soon As Possible", "As Soon As Possible"], ["Start On", "Start On"], ["Finish On", "Finish On"]]} onChange={setConstraintType} />
                            <SettingsSelectRow label="Responsible" value={responsible} colors={colors} options={[["Responsible", "Responsible"], ["Planning", "Planning"], ["Project Control", "Project Control"]]} onChange={setResponsible} />
                            <SettingsSelectRow label="Primary Resource" value={primaryResource} colors={colors} options={[["Primary Resource", "Primary Resource"], ["Contractor", "Contractor"], ["Engineering", "Engineering"]]} onChange={setPrimaryResource} />
                            <SettingsSelectRow label="Progress Calculation" value={progressCalculation} colors={colors} options={[["weighted", "Weighted"], ["duration", "Duration"], ["physical", "Physical"], ["units", "Units"]]} onChange={handleProgressCalculation} />
                            <SettingsSelectRow label="Percent Complete Type" value={percentCompleteType} colors={colors} options={[["Weighted", "Weighted"], ["Duration", "Duration"], ["Physical", "Physical"], ["Units", "Units"]]} onChange={handlePercentType} />
                        </Box>
                        </Box>
                    </PmsSettingsSection>
                </Box>
                    </Box>
                <RelationshipEditor
                    open={relationshipEditorOpen}
                    onClose={() => setRelationshipEditorOpen(false)}
                    row={selectedActivity}
                    rows={editableRows}
                    colors={colors}
                    onSave={handleRelationshipSave}
                />
                <CalendarManager
                    open={calendarManagerOpen}
                    onClose={() => setCalendarManagerOpen(false)}
                    calendars={calendars}
                    onChange={setCalendars}
                    projectCalendarId={projectCalendarId}
                    onProjectCalendarChange={setProjectCalendarId}
                    colors={colors}
                />
            </Box>
        </Box>
    );
}