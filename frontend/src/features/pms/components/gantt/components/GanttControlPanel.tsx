import type {
    ReactNode
} from "react";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography
} from "@mui/material";

import type {
    GanttCustomColors,
    GanttPalette
} from "../ganttTypes";

import {
    SETTINGS_OPTIONS
} from "../ganttConstants";

/* =========================================================
 * TYPES
 * ========================================================= */

interface GanttControlPanelProps {
    colors: GanttPalette;

    activityType: string;
    setActivityType: (v: string) => void;

    durationType: string;
    setDurationType: (v: string) => void;

    calendar: string;
    setCalendar: (v: string) => void;

    activityCode: string;
    setActivityCode: (v: string) => void;

    schedulingMode: string;
    setSchedulingMode: (v: string) => void;

    constraintType: string;
    setConstraintType: (v: string) => void;

    responsible: string;
    setResponsible: (v: string) => void;

    primaryResource: string;
    setPrimaryResource: (v: string) => void;

    progressCalculation: string;
    setProgressCalculation: (v: string) => void;

    percentCompleteType: string;
    setPercentCompleteType: (v: string) => void;

    barStyle:
        | "flat"
        | "gradient"
        | "threeD";

    setBarStyle: (
        v:
            | "flat"
            | "gradient"
            | "threeD"
    ) => void;

    colorPreset: string;

    setColorPreset: (
        value: string
    ) => void;

    customColors: GanttCustomColors;

    updateCustomColor: (
        key: keyof GanttCustomColors,
        value: string
    ) => void;

    resetColors: () => void;

    parsedStatusDate: Date | null;

    statusDateVisible: boolean;

    showDataDate: boolean;

    setShowDataDate: (
        v: boolean
    ) => void;

    dataDate: string;

    setDataDate: (
        v: string
    ) => void;
}

/* =========================================================
 * CONSTANTS
 * ========================================================= */

const COLOR_PRESETS = {
    theme: "PCS Professional",
    corporate: "Corporate Blue",
    engineering: "Engineering",
    p6: "Classic P6",
    slate: "Executive Slate",
    highContrast: "High Contrast",
    custom: "Custom"
};

const BAR_STYLE_OPTIONS = {
    flat: "Flat",
    gradient: "Gradient",
    threeD: "3D / P6"
};

const CUSTOM_COLOR_ITEMS: Array<{
    key: keyof GanttCustomColors;
    label: string;
}> = [
    {
        key: "wbsLevel1",
        label: "WBS L1"
    },
    {
        key: "wbsLevel2",
        label: "WBS L2"
    },
    {
        key: "wbsLevel3",
        label: "WBS L3"
    },
    {
        key: "wbsLevel4",
        label: "WBS L4"
    },
    {
        key: "activity",
        label: "Activity"
    },
    {
        key: "critical",
        label: "Critical"
    },
    {
        key: "milestone",
        label: "Milestone"
    }
];

const FONT_STACK =
    "Vazirmatn, Segoe UI, Inter, Roboto, Arial, sans-serif";

/* =========================================================
 * LIGHT CONTROL COLORS
 * ========================================================= */

const CONTROL_BG =
    "#FFFFFF";

const CONTROL_BG_HOVER =
    "#F5F8FB";

const CONTROL_BORDER =
    "#CBD5E1";

const CONTROL_BORDER_HOVER =
    "#94A3B8";

const CONTROL_BORDER_ACTIVE =
    "#2563EB";

const CONTROL_TEXT =
    "#1E293B";

const CONTROL_MUTED =
    "#64748B";

const CONTROL_ACTIVE =
    "#2563EB";

const MENU_BG =
    "#FFFFFF";

const MENU_SELECTED =
    "rgba(37, 99, 235, 0.09)";

const MENU_SELECTED_HOVER =
    "rgba(37, 99, 235, 0.15)";

/* =========================================================
 * DIMENSIONS
 * ========================================================= */

const FIELD_HEIGHT =
    31;

const LABEL_FONT_SIZE =
    8;

const FIELD_FONT_SIZE =
    9.5;

const MENU_FONT_SIZE =
    9.5;

/* =========================================================
 * SELECT FIELD
 * ========================================================= */

function SelectField({
    label,
    value,
    options,
    onChange,
    minWidth = 120,
    flex = "1 1 120px"
}: {
    label: string;
    value: string | number;
    options: Record<string, string>;
    onChange: (value: string) => void;
    minWidth?: number;
    flex?: string;
}) {
    return (
        <FormControl
            size="small"
            sx={{
                flex,
                minWidth,

                "& .MuiInputLabel-root": {
                    fontFamily:
                        FONT_STACK,

                    fontSize:
                        LABEL_FONT_SIZE,

                    fontWeight:
                        600,

                    color:
                        CONTROL_MUTED,

                    lineHeight:
                        1.15,

                    transform:
                        "translate(10px, 7px) scale(1)"
                },

                "& .MuiInputLabel-root.MuiInputLabel-shrink":
                    {
                        transform:
                            "translate(10px, -6px) scale(0.74)",

                        color:
                            CONTROL_ACTIVE,

                        backgroundColor:
                            CONTROL_BG,

                        px:
                            0.45
                    },

                "& .MuiInputLabel-root.Mui-focused":
                    {
                        color:
                            CONTROL_ACTIVE
                    },

                "& .MuiOutlinedInput-root":
                    {
                        height:
                            FIELD_HEIGHT,

                        minHeight:
                            FIELD_HEIGHT,

                        borderRadius:
                            0.8,

                        backgroundColor:
                            CONTROL_BG,

                        color:
                            CONTROL_TEXT,

                        fontFamily:
                            FONT_STACK,

                        transition:
                            "border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease",

                        "& fieldset":
                            {
                                borderColor:
                                    CONTROL_BORDER
                            },

                        "&:hover":
                            {
                                backgroundColor:
                                    CONTROL_BG_HOVER
                            },

                        "&:hover fieldset":
                            {
                                borderColor:
                                    CONTROL_BORDER_HOVER
                            },

                        "&.Mui-focused":
                            {
                                backgroundColor:
                                    "#FFFFFF",

                                boxShadow:
                                    "0 0 0 2px rgba(37,99,235,.07)"
                            },

                        "&.Mui-focused fieldset":
                            {
                                borderColor:
                                    CONTROL_BORDER_ACTIVE,

                                borderWidth:
                                    1
                            }
                    },

                "& .MuiSelect-select":
                    {
                        display:
                            "flex",

                        alignItems:
                            "center",

                        minHeight:
                            `${FIELD_HEIGHT - 2}px !important`,

                        boxSizing:
                            "border-box",

                        py:
                            0.1,

                        px:
                            0.9,

                        fontFamily:
                            FONT_STACK,

                        fontSize:
                            FIELD_FONT_SIZE,

                        fontWeight:
                            600,

                        color:
                            CONTROL_TEXT
                    },

                "& .MuiSvgIcon-root":
                    {
                        color:
                            CONTROL_MUTED,

                        fontSize:
                            16
                    }
            }}
        >
            <InputLabel>
                {label}
            </InputLabel>

            <Select
                value={
                    value
                }

                label={
                    label
                }

                MenuProps={{
                    PaperProps: {
                        sx: {
                            mt:
                                0.4,

                            backgroundColor:
                                MENU_BG,

                            color:
                                CONTROL_TEXT,

                            border:
                                `1px solid ${CONTROL_BORDER}`,

                            borderRadius:
                                1,

                            boxShadow:
                                "0 12px 28px rgba(15,23,42,.14)",

                            overflow:
                                "hidden",

                            "& .MuiMenuItem-root":
                                {
                                    minHeight:
                                        30,

                                    mx:
                                        0.35,

                                    my:
                                        0.08,

                                    px:
                                        0.95,

                                    borderRadius:
                                        0.55,

                                    fontFamily:
                                        FONT_STACK,

                                    fontSize:
                                        MENU_FONT_SIZE,

                                    fontWeight:
                                        500,

                                    color:
                                        CONTROL_TEXT,

                                    transition:
                                        "background-color 100ms ease, color 100ms ease",

                                    "&:hover":
                                        {
                                            backgroundColor:
                                                CONTROL_BG_HOVER
                                        },

                                    "&.Mui-selected":
                                        {
                                            backgroundColor:
                                                MENU_SELECTED,

                                            color:
                                                CONTROL_ACTIVE,

                                            fontWeight:
                                                700
                                        },

                                    "&.Mui-selected:hover":
                                        {
                                            backgroundColor:
                                                MENU_SELECTED_HOVER
                                        }
                                }
                        }
                    }
                }}

                onChange={
                    event =>
                        onChange(
                            String(
                                event.target.value
                            )
                        )
                }
            >
                {Object.entries(
                    options
                ).map(
                    ([key, text]) => (
                        <MenuItem
                            key={
                                key
                            }

                            value={
                                key
                            }
                        >
                            {text}
                        </MenuItem>
                    )
                )}
            </Select>
        </FormControl>
    );
}

/* =========================================================
 * SETTINGS SECTION
 * ========================================================= */

function SettingsCard({
    title,
    subtitle,
    accent,
    children,
    colors
}: {
    title: string;
    subtitle: string;
    accent: string;
    children: ReactNode;
    colors: GanttPalette;
}) {
    return (
        <Box
            sx={{
                minWidth:
                    0,

                width:
                    "100%",

                flex:
                    "1 1 100%",

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    1.25,

                backgroundColor:
                    "#FFFFFF",

                overflow:
                    "hidden",

                boxShadow:
                    "0 1px 3px rgba(15,39,66,.045)"
            }}
        >
            <Box
                sx={{
                    minHeight:
                        39,

                    height:
                        39,

                    px:
                        1.15,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "flex-end",

                    gap:
                        0.7,

                    backgroundColor:
                        "#F8FAFC",

                    borderBottom:
                        `1px solid ${colors.border}`
                }}
            >
                <Typography
                    sx={{
                        minWidth:
                            0,

                        fontFamily:
                            FONT_STACK,

                        fontSize:
                            12,

                        fontWeight:
                            850,

                        color:
                            colors.text,

                        letterSpacing:
                            "0.045em",

                        lineHeight:
                            1,

                        whiteSpace:
                            "nowrap",

                        textAlign:
                            "right"
                    }}
                >
                    {title}
                </Typography>

                <Box
                    sx={{
                        width:
                            4,

                        height:
                            21,

                        flexShrink:
                            0,

                        borderRadius:
                            2,

                        backgroundColor:
                            accent
                    }}
                />

                <Typography
                    sx={{
                        minWidth:
                            0,

                        maxWidth:
                            "42%",

                        fontFamily:
                            FONT_STACK,

                        fontSize:
                            8,

                        fontWeight:
                            500,

                        color:
                            colors.muted,

                        whiteSpace:
                            "nowrap",

                        overflow:
                            "hidden",

                        textOverflow:
                            "ellipsis",

                        textAlign:
                            "right"
                    }}
                >
                    {subtitle}
                </Typography>
            </Box>

            <Box
                sx={{
                    p:
                        0.8,

                    display:
                        "grid",

                    gridTemplateColumns:
                        "repeat(12, minmax(0, 1fr))",

                    alignItems:
                        "center",

                    gap:
                        0.6,

                    backgroundColor:
                        "#FFFFFF"
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

/* =========================================================
 * DATA DATE
 * ========================================================= */

function DataDateControl({
    parsedStatusDate,
    statusDateVisible,
    showDataDate,
    setShowDataDate,
    dataDate,
    setDataDate,
    colors
}: {
    parsedStatusDate: Date | null;
    statusDateVisible: boolean;
    showDataDate: boolean;
    setShowDataDate: (
        value: boolean
    ) => void;
    dataDate: string;
    setDataDate: (
        value: string
    ) => void;
    colors: GanttPalette;
}) {
    const fallbackDate =
        parsedStatusDate
            ? parsedStatusDate
                  .toISOString()
                  .slice(
                      0,
                      10
                  )
            : "";

    const effectiveDate =
        dataDate ||
        fallbackDate;

    const enabled =
        Boolean(
            effectiveDate
        ) &&
        showDataDate;

    return (
        <Box
            sx={{
                gridColumn:
                    "span 4",

                minWidth:
                    0,

                minHeight:
                    FIELD_HEIGHT,

                height:
                    FIELD_HEIGHT,

                px:
                    0.65,

                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    0.45,

                border:
                    `1px solid ${
                        enabled
                            ? colors.primary
                            : colors.border
                    }`,

                borderRadius:
                    0.8,

                backgroundColor:
                    enabled
                        ? "#F5FAFF"
                        : "#F8FAFC",

                boxSizing:
                    "border-box"
            }}
        >
            <Box
                sx={{
                    width:
                        6,

                    height:
                        6,

                    flexShrink:
                        0,

                    borderRadius:
                        "50%",

                    backgroundColor:
                        enabled
                            ? colors.primary
                            : statusDateVisible
                              ? "#D69E2E"
                              : colors.muted,

                    boxShadow:
                        enabled
                            ? `0 0 5px ${colors.primary}`
                            : "none"
                }}
            />

            <Typography
                sx={{
                    flexShrink:
                        0,

                    fontFamily:
                        FONT_STACK,

                    fontSize:
                        7.2,

                    fontWeight:
                        800,

                    color:
                        colors.muted,

                    letterSpacing:
                        "0.035em",

                    whiteSpace:
                        "nowrap"
                }}
            >
                DATA DATE
            </Typography>

            <Box
                component="input"
                type="date"
                value={
                    effectiveDate
                }
                onChange={
                    event =>
                        setDataDate(
                            event.target.value
                        )
                }
                aria-label="Data Date"
                sx={{
                    minWidth:
                        0,

                    flex:
                        1,

                    height:
                        25,

                    px:
                        0.55,

                    border:
                        `1px solid ${CONTROL_BORDER}`,

                    borderRadius:
                        0.65,

                    outline:
                        "none",

                    backgroundColor:
                        "#FFFFFF",

                    color:
                        enabled
                            ? colors.primary
                            : colors.text,

                    fontFamily:
                        FONT_STACK,

                    fontSize:
                        8.8,

                    fontWeight:
                        750,

                    fontVariantNumeric:
                        "tabular-nums",

                    boxSizing:
                        "border-box",

                    cursor:
                        "pointer",

                    "&:hover":
                        {
                            borderColor:
                                CONTROL_BORDER_HOVER
                        },

                    "&:focus":
                        {
                            borderColor:
                                CONTROL_BORDER_ACTIVE,

                            boxShadow:
                                "0 0 0 2px rgba(37,99,235,.07)"
                        },

                    "&::-webkit-calendar-picker-indicator":
                        {
                            cursor:
                                "pointer",

                            opacity:
                                0.65
                        }
                }}
            />

            <Switch
                size="small"

                checked={
                    showDataDate
                }

                disabled={
                    !effectiveDate
                }

                onChange={
                    event =>
                        setShowDataDate(
                            event.target.checked
                        )
                }

                sx={{
                    width:
                        35,

                    height:
                        21,

                    p:
                        0.1,

                    flexShrink:
                        0,

                    "& .MuiSwitch-switchBase":
                        {
                            p:
                                0.3
                        },

                    "& .MuiSwitch-thumb":
                        {
                            width:
                                15,

                            height:
                                15,

                            backgroundColor:
                                "#FFFFFF",

                            boxShadow:
                                "0 1px 3px rgba(0,0,0,.18)"
                        },

                    "& .MuiSwitch-track":
                        {
                            borderRadius:
                                20,

                            backgroundColor:
                                "#AAB7C2",

                            opacity:
                                1
                        },

                    "& .MuiSwitch-switchBase.Mui-checked":
                        {
                            color:
                                CONTROL_ACTIVE,

                            transform:
                                "translateX(14px)"
                        },

                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                            backgroundColor:
                                CONTROL_ACTIVE,

                            opacity:
                                1
                        },

                    "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track":
                        {
                            opacity:
                                0.35
                        }
                }}
            />
        </Box>
    );
}

/* =========================================================
 * COLOR EDITOR
 * ========================================================= */

function ColorEditor({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (
        value: string
    ) => void;
}) {
    return (
        <Box
            sx={{
                height:
                    28,

                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    0.45,

                px:
                    0.55,

                border:
                    `1px solid ${CONTROL_BORDER}`,

                borderRadius:
                    0.7,

                backgroundColor:
                    "#FFFFFF",

                transition:
                    "border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease",

                "&:hover":
                    {
                        borderColor:
                            CONTROL_BORDER_HOVER,

                        backgroundColor:
                            "#F8FAFC"
                    },

                "&:focus-within":
                    {
                        borderColor:
                            CONTROL_BORDER_ACTIVE,

                        boxShadow:
                            "0 0 0 2px rgba(37,99,235,.07)"
                    }
            }}
        >
            <Box
                sx={{
                    width:
                        12,

                    height:
                        12,

                    flexShrink:
                        0,

                    borderRadius:
                        0.5,

                    backgroundColor:
                        value,

                    border:
                        "1px solid rgba(15,23,42,.18)"
                }}
            />

            <Typography
                sx={{
                    fontFamily:
                        FONT_STACK,

                    fontSize:
                        8,

                    fontWeight:
                        650,

                    color:
                        CONTROL_TEXT,

                    whiteSpace:
                        "nowrap"
                }}
            >
                {label}
            </Typography>

            <Box
                component="input"

                type="color"

                value={
                    value
                }

                aria-label={
                    label
                }

                onChange={
                    event =>
                        onChange(
                            event.target.value
                        )
                }

                sx={{
                    width:
                        24,

                    height:
                        21,

                    p:
                        0,

                    border:
                        0,

                    borderRadius:
                        0.5,

                    background:
                        "transparent",

                    cursor:
                        "pointer"
                }}
            />
        </Box>
    );
}

/* =========================================================
 * RESET BUTTON
 * ========================================================= */

function ResetButton({
    colors,
    onClick
}: {
    colors: GanttPalette;
    onClick: () => void;
}) {
    return (
        <Box
            component="button"

            type="button"

            onClick={
                onClick
            }

            sx={{
                height:
                    28,

                px:
                    1,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    0.7,

                backgroundColor:
                    "#F8FAFC",

                color:
                    colors.muted,

                fontFamily:
                    FONT_STACK,

                fontSize:
                    8,

                fontWeight:
                    700,

                cursor:
                    "pointer",

                transition:
                    "all 120ms ease",

                "&:hover":
                    {
                        borderColor:
                            colors.primary,

                        color:
                            colors.primary,

                        backgroundColor:
                            "#F5FAFF"
                    }
            }}
        >
            Reset Colors
        </Box>
    );
}

/* =========================================================
 * COMPONENT
 * ========================================================= */

export default function GanttControlPanel({
    colors,

    activityType,
    setActivityType,

    durationType,
    setDurationType,

    calendar,
    setCalendar,

    activityCode,
    setActivityCode,

    schedulingMode,
    setSchedulingMode,

    constraintType,
    setConstraintType,

    responsible,
    setResponsible,

    primaryResource,
    setPrimaryResource,

    progressCalculation,
    setProgressCalculation,

    percentCompleteType,
    setPercentCompleteType,

    barStyle,
    setBarStyle,

    colorPreset,
    setColorPreset,

    customColors,
    updateCustomColor,

    resetColors,

    parsedStatusDate,
    statusDateVisible,

    showDataDate,
    setShowDataDate,

    dataDate,
    setDataDate
}: GanttControlPanelProps) {
    return (
        <Box
            sx={{
                width:
                    "100%",

                height:
                    "100%",

                minWidth:
                    0,

                minHeight:
                    0,

                overflow:
                    "auto",

                px:
                    {
                        xs:
                            0.7,

                        md:
                            0.9
                    },

                py:
                    0.8,

                boxSizing:
                    "border-box",

                display:
                    "flex",

                flexDirection:
                    "column",

                alignItems:
                    "stretch",

                gap:
                    0.8,

                backgroundColor:
                    colors.surface,

                fontFamily:
                    FONT_STACK,

                "&::-webkit-scrollbar":
                    {
                        width:
                            7,

                        height:
                            7
                    },

                "&::-webkit-scrollbar-thumb":
                    {
                        backgroundColor:
                            colors.border,

                        borderRadius:
                            10
                    },

                "&::-webkit-scrollbar-track":
                    {
                        backgroundColor:
                            "transparent"
                    }
            }}
        >
            {/* =================================================
             * PROGRAM SETTINGS
             * ================================================= */}

            <SettingsCard
                title="PROGRAM SETTINGS"
                subtitle="Planning · CPM · Progress · Data Date"
                accent="#2563EB"
                colors={
                    colors
                }
            >
                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Activity Type"
                        value={
                            activityType
                        }
                        options={
                            SETTINGS_OPTIONS.activityType
                        }
                        onChange={
                            setActivityType
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Duration Type"
                        value={
                            durationType
                        }
                        options={
                            SETTINGS_OPTIONS.durationType
                        }
                        onChange={
                            setDurationType
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Calendar"
                        value={
                            calendar
                        }
                        options={
                            SETTINGS_OPTIONS.calendar
                        }
                        onChange={
                            setCalendar
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Activity Code"
                        value={
                            activityCode
                        }
                        options={
                            SETTINGS_OPTIONS.activityCode
                        }
                        onChange={
                            setActivityCode
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="CPM Mode"
                        value={
                            schedulingMode
                        }
                        options={
                            SETTINGS_OPTIONS.schedulingMode
                        }
                        onChange={
                            setSchedulingMode
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Constraint"
                        value={
                            constraintType
                        }
                        options={
                            SETTINGS_OPTIONS.constraint
                        }
                        onChange={
                            setConstraintType
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Responsible"
                        value={
                            responsible
                        }
                        options={
                            SETTINGS_OPTIONS.responsible
                        }
                        onChange={
                            setResponsible
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 3"
                    }}
                >
                    <SelectField
                        label="Primary Resource"
                        value={
                            primaryResource
                        }
                        options={
                            SETTINGS_OPTIONS.primaryResource
                        }
                        onChange={
                            setPrimaryResource
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                {/* PROGRESS */}

                <Box
                    sx={{
                        gridColumn:
                            "span 4",

                        minWidth:
                            0,

                        minHeight:
                            FIELD_HEIGHT,

                        height:
                            FIELD_HEIGHT,

                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            0.45,

                        px:
                            0.55,

                        border:
                            `1px solid ${colors.border}`,

                        borderRadius:
                            0.8,

                        backgroundColor:
                            "#F8FAFC",

                        boxSizing:
                            "border-box"
                    }}
                >
                    <Typography
                        sx={{
                            flexShrink:
                                0,

                            fontFamily:
                                FONT_STACK,

                            fontSize:
                                7.6,

                            fontWeight:
                                800,

                            color:
                                colors.muted,

                            letterSpacing:
                                "0.025em",

                            whiteSpace:
                                "nowrap"
                        }}
                    >
                        PROGRESS
                    </Typography>

                    <SelectField
                        label="Calculation"
                        value={
                            progressCalculation
                        }
                        options={
                            SETTINGS_OPTIONS.calculation
                        }
                        onChange={
                            setProgressCalculation
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                {/* PERCENT COMPLETE */}

                <Box
                    sx={{
                        gridColumn:
                            "span 4"
                    }}
                >
                    <SelectField
                        label="% Complete"
                        value={
                            percentCompleteType
                        }
                        options={
                            SETTINGS_OPTIONS.percentType
                        }
                        onChange={
                            setPercentCompleteType
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                {/* DATA DATE */}

                <DataDateControl
                    parsedStatusDate={
                        parsedStatusDate
                    }

                    statusDateVisible={
                        statusDateVisible
                    }

                    showDataDate={
                        showDataDate
                    }

                    setShowDataDate={
                        setShowDataDate
                    }

                    dataDate={
                        dataDate
                    }

                    setDataDate={
                        setDataDate
                    }

                    colors={
                        colors
                    }
                />
            </SettingsCard>

            {/* =================================================
             * VISUAL SETTINGS
             * ================================================= */}

            <SettingsCard
                title="VISUAL SETTINGS"
                subtitle="Bar Style · Color Preset · Custom Palette"
                accent="#0F766E"
                colors={
                    colors
                }
            >
                <Box
                    sx={{
                        gridColumn:
                            "span 7"
                    }}
                >
                    <SelectField
                        label="Color Preset"
                        value={
                            colorPreset
                        }
                        options={
                            COLOR_PRESETS
                        }
                        onChange={
                            setColorPreset
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                <Box
                    sx={{
                        gridColumn:
                            "span 5"
                    }}
                >
                    <SelectField
                        label="Bar Style"
                        value={
                            barStyle
                        }
                        options={
                            BAR_STYLE_OPTIONS
                        }
                        onChange={
                            value => {
                                if (
                                    value ===
                                        "flat" ||
                                    value ===
                                        "gradient" ||
                                    value ===
                                        "threeD"
                                ) {
                                    setBarStyle(
                                        value
                                    );
                                }
                            }
                        }
                        minWidth={
                            0
                        }
                        flex={
                            "1 1 auto"
                        }
                    />
                </Box>

                {colorPreset ===
                    "custom" && (
                    <Box
                        sx={{
                            gridColumn:
                                "1 / -1",

                            mt:
                                0.05,

                            pt:
                                0.6,

                            display:
                                "flex",

                            flexWrap:
                                "wrap",

                            alignItems:
                                "center",

                            justifyContent:
                                "flex-start",

                            gap:
                                0.4,

                            borderTop:
                                `1px solid ${colors.border}`
                        }}
                    >
                        <Typography
                            sx={{
                                width:
                                    "100%",

                                mb:
                                    0.05,

                                fontFamily:
                                    FONT_STACK,

                                fontSize:
                                    7.8,

                                fontWeight:
                                    800,

                                color:
                                    colors.muted,

                                letterSpacing:
                                    "0.04em",

                                textAlign:
                                    "right"
                            }}
                        >
                            CUSTOM BAR PALETTE
                        </Typography>

                        {CUSTOM_COLOR_ITEMS.map(
                            item => (
                                <ColorEditor
                                    key={
                                        item.key
                                    }

                                    label={
                                        item.label
                                    }

                                    value={
                                        customColors[
                                            item.key
                                        ]
                                    }

                                    onChange={
                                        value =>
                                            updateCustomColor(
                                                item.key,
                                                value
                                            )
                                    }
                                />
                            )
                        )}

                        <ResetButton
                            colors={
                                colors
                            }

                            onClick={
                                resetColors
                            }
                        />
                    </Box>
                )}
            </SettingsCard>
        </Box>
    );
}