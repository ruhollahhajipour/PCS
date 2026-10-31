import type {
    GanttColorPreset,
    PmsColumnDefinition,
    PmsColumnKey,
    TimelineScale,
    GanttFormulaColumnDefinition,
    GanttSettings
} from "./ganttTypes";

export const PMS_COLUMNS: PmsColumnDefinition[] = [
    {
        key: "code",
        label: "WBS / ID",
        width: 56,
        mandatory: true,
        align: "left"
    },
    {
        key: "activity",
        label: "WBS / ACTIVITY NAME",
        width: 214,
        mandatory: true,
        align: "left"
    },
    {
        key: "start",
        label: "START",
        width: 78,
        align: "center"
    },
    {
        key: "finish",
        label: "FINISH",
        width: 78,
        align: "center"
    },
    {
        key: "duration",
        label: "DUR.",
        width: 50,
        align: "right"
    },
    {
        key: "wf",
        label: "WF",
        width: 48,
        align: "right"
    },
    {
        key: "wv",
        label: "WV",
        width: 56,
        align: "right"
    },
    {
        key: "plannedProgress",
        label: "PLANNED",
        width: 72,
        align: "right"
    },
    {
        key: "actualProgress",
        label: "ACTUAL",
        width: 72,
        align: "right"
    },
    {
        key: "remaining",
        label: "REMAIN.",
        width: 62,
        align: "right"
    },
    {
        key: "totalFloat",
        label: "TF",
        width: 46,
        align: "right"
    },
    {
        key: "freeFloat",
        label: "FF",
        width: 46,
        align: "right"
    },
    {
        key: "status",
        label: "STATUS",
        width: 76,
        align: "left"
    },

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    {
        key: "relationships",
        label: "RELATIONSHIPS",
        width: 120,
        align: "left"
    },
    {
        key: "predecessors",
        label: "PREDECESSORS",
        width: 120,
        align: "left"
    },
    {
        key: "successors",
        label: "SUCCESSORS",
        width: 120,
        align: "left"
    },

    // ============================================================
    // ACTUAL DATES
    // ============================================================

    {
        key: "actualStart",
        label: "ACTUAL START",
        width: 92,
        align: "center"
    },
    {
        key: "actualFinish",
        label: "ACTUAL FINISH",
        width: 92,
        align: "center"
    },

    // ============================================================
    // CONSTRAINTS
    // ============================================================

    {
        key: "constraint",
        label: "CONSTRAINT",
        width: 110,
        align: "left"
    },
    {
        key: "constraintDate",
        label: "CONSTRAINT DATE",
        width: 100,
        align: "center"
    },

    // ============================================================
    // CPM
    // ============================================================

    {
        key: "earlyStart",
        label: "ES",
        width: 58,
        align: "right"
    },
    {
        key: "earlyFinish",
        label: "EF",
        width: 58,
        align: "right"
    },
    {
        key: "lateStart",
        label: "LS",
        width: 58,
        align: "right"
    },
    {
        key: "lateFinish",
        label: "LF",
        width: 58,
        align: "right"
    },
    {
        key: "drivingFloat",
        label: "DRIVING FLOAT",
        width: 82,
        align: "right"
    },
    {
        key: "critical",
        label: "CRITICAL",
        width: 68,
        align: "center"
    }
];

export const DEFAULT_VISIBLE_PMS_COLUMNS: PmsColumnKey[] = [
    "code",
    "activity",
    "start",
    "finish",
    "duration",
    "wf",
    "wv",
    "plannedProgress",
    "actualProgress"
];

export const SETTINGS_OPTIONS = {
    activityType: {
        "Task Dependent": "Task Dependent",
        "Resource Dependent": "Resource Dependent",
        "Level of Effort": "Level of Effort",
        "Start Milestone": "Start Milestone",
        "Finish Milestone": "Finish Milestone"
    },

    durationType: {
        "Fixed Duration": "Fixed Duration",
        "Fixed Units": "Fixed Units",
        "Fixed Work": "Fixed Work"
    },

    calendar: {
        "Project Calendar": "Project Calendar",
        "Standard 5 Day": "Standard 5 Day",
        "6 Day Calendar": "6 Day Calendar",
        "7 Day Calendar": "7 Day Calendar"
    },

    activityCode: {
        "Activity ID": "Activity ID",
        "WBS Code": "WBS Code",
        "User Defined": "User Defined"
    },

    schedulingMode: {
        CPM: "CPM",
        Manual: "Manual"
    },

    constraint: {
        "As Soon As Possible": "As Soon As Possible",
        "Start On": "Start On",
        "Finish On": "Finish On",
        "Must Finish By": "Must Finish By"
    },

    responsible: {
        Responsible: "Responsible",
        "Project Manager": "Project Manager",
        "Discipline Manager": "Discipline Manager"
    },

    primaryResource: {
        "Primary Resource": "Primary Resource",
        Engineering: "Engineering",
        Procurement: "Procurement",
        Construction: "Construction"
    },

    calculation: {
        duration: "Duration",
        physical: "Physical",
        units: "Units",
        weighted: "Weighted"
    },

    percentType: {
        Duration: "Duration",
        Physical: "Physical",
        Units: "Units",
        Weighted: "Weighted"
    }
} satisfies Record<string, Record<string, string>>;

export const SCALE_OPTIONS: Record<TimelineScale, string> = {
    day: "Day",
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    year: "Year"
};

export const SCALE_SHORT_LABELS: Record<TimelineScale, string> = {
    day: "D",
    week: "W",
    month: "M",
    quarter: "Q",
    year: "Y"
};

export const TIMESCALE_PRESETS: Record<
    TimelineScale,
    {
        primary: TimelineScale;
        secondary: TimelineScale | "none";
        dayWidth: number;
        primaryFormat: string;
        secondaryFormat: string;
    }
> = {
    day: {
        primary: "day",
        secondary: "week",
        dayWidth: 32,
        primaryFormat: "DD",
        secondaryFormat: "WW"
    },
    week: {
        primary: "week",
        secondary: "month",
        dayWidth: 24,
        primaryFormat: "Wk WW",
        secondaryFormat: "MMM YYYY"
    },
    month: {
        primary: "month",
        secondary: "year",
        dayWidth: 28,
        primaryFormat: "MMM",
        secondaryFormat: "YYYY"
    },
    quarter: {
        primary: "quarter",
        secondary: "year",
        dayWidth: 22,
        primaryFormat: "Qn",
        secondaryFormat: "YYYY"
    },
    year: {
        primary: "year",
        secondary: "none",
        dayWidth: 18,
        primaryFormat: "YYYY",
        secondaryFormat: ""
    }
};

export const COLOR_PRESETS: Record<GanttColorPreset, string> = {
    theme: "PCS Theme",
    corporate: "Corporate Blue",
    engineering: "Engineering",
    p6: "Classic P6",
    slate: "Executive Slate",
    highContrast: "High Contrast",
    custom: "Custom"
};

/**
 * Formula column defaults. These are intentionally empty: formula columns
 * are user-created and persisted separately from built-in PMS columns.
 */
export const DEFAULT_FORMULA_COLUMNS: GanttFormulaColumnDefinition[] = [];

export const GANTT_FORMULA_STORAGE_KEY = "pcs:gantt:formula-columns:v1";
export const GANTT_SETTINGS_STORAGE_KEY = "pcs:gantt:settings:v1";
export const GANTT_TIMESCALE_STORAGE_KEY = "pcs:gantt:timescale:v1";

export const COLUMNS_STORAGE_KEY = "pcs:gantt:columns";
export const STORAGE_KEY = "pcs:gantt:appearance";

export const ROW_HEIGHT = 30;
export const HEADER_HEIGHT = 46;

export const MIN_ROW_HEIGHT = 22;
export const MAX_ROW_HEIGHT = 44;

export const MIN_DAY_WIDTH = 12;
export const MAX_DAY_WIDTH = 64;
export const DEFAULT_DAY_WIDTH = 28;

export const DEFAULT_TIMELINE_SCALE: TimelineScale = "month";

export const MIN_COLUMN_WIDTH = 40;
export const MAX_COLUMN_WIDTH = 500;

export const DEFAULT_FORMULA_COLUMN_WIDTH = 110;
export const MIN_FORMULA_COLUMN_WIDTH = 60;
export const MAX_FORMULA_COLUMN_WIDTH = 500;

export const FORMULA_MAX_LENGTH = 1000;
export const FORMULA_DEFAULT_DECIMALS = 2;

export const DEFAULT_GANTT_SETTINGS: GanttSettings = {
    timescale: {
        primaryScale: DEFAULT_TIMELINE_SCALE,
        secondaryScale: "year",
        dayWidth: DEFAULT_DAY_WIDTH,
        showWeekNumbers: false,
        showYear: true,
        compactHeaders: true,
        primaryDateFormat: "MMM",
        secondaryDateFormat: "YYYY"
    },
    grid: {
        showVerticalGrid: true,
        showHorizontalGrid: true,
        showMajorGrid: true,
        showMinorGrid: true,
        showWeekends: true,
        showTodayLine: true,
        showDataDateLine: true
    },
    bars: {
        showBars: true,
        showProgress: true,
        showActual: true,
        showLabels: false,
        showRelationships: true,
        barHeight: 12,
        progressHeight: 5,
        labelPosition: "right"
    },
    appearance: {
        rowHeight: ROW_HEIGHT,
        fontFamily: "Vazirmatn",
        fontSize: 10,
        headerFontSize: 9,
        borderRadius: 1,
        compactToolbar: true,
        alternateRowFill: false
    }
};
