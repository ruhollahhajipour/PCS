import {
    Box,
    Chip,
    Divider,
    Popover,
    Typography
} from "@mui/material";

import {
    PaletteOutlined,
    RestartAltOutlined
} from "@mui/icons-material";

import type {
    GanttColorPreset,
    GanttCustomColors,
    GanttPalette
} from "../ganttTypes";

export interface GanttAppearancePopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;

    colors: GanttPalette;

    colorSettings: {
        preset: GanttColorPreset;
    };

    customColors: GanttCustomColors;

    setColorPreset: (
        preset: GanttColorPreset
    ) => void;

    updateCustomColor: (
        key: keyof GanttCustomColors,
        value: string
    ) => void;

    resetColors: () => void;
}

type ColorItem = [
    string,
    keyof GanttCustomColors
];

const COLOR_GROUPS: [
    string,
    ColorItem[]
][] = [
    [
        "WBS HIERARCHY",
        [
            ["Level 1", "wbsLevel1"],
            ["Level 2", "wbsLevel2"],
            ["Level 3", "wbsLevel3"],
            ["Level 4+", "wbsLevel4"]
        ]
    ],
    [
        "SCHEDULE",
        [
            ["Activity", "activity"],
            ["Critical", "critical"],
            ["Milestone", "milestone"]
        ]
    ]
];

const PRESETS: {
    value: GanttColorPreset;
    label: string;
}[] = [
    {
        value: "theme",
        label: "PCS Theme"
    },
    {
        value: "corporate",
        label: "Corporate Blue"
    },
    {
        value: "engineering",
        label: "Engineering"
    },
    {
        value: "p6",
        label: "Classic P6"
    },
    {
        value: "slate",
        label: "Executive Slate"
    },
    {
        value: "highContrast",
        label: "High Contrast"
    }
];

function presetLabel(
    preset: GanttColorPreset
): string {
    return (
        PRESETS.find(
            item => item.value === preset
        )?.label ??
        preset
    );
}

export default function GanttAppearancePopover({
    open,
    anchorEl,
    onClose,
    colors,
    colorSettings,
    customColors,
    setColorPreset,
    updateCustomColor,
    resetColors
}: GanttAppearancePopoverProps) {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 338,
                        mt: 0.7,
                        borderRadius: 1.5,
                        overflow: "hidden",
                        border:
                            `1px solid ${colors.border}`,
                        backgroundColor:
                            colors.surface,
                        boxShadow:
                            "0 18px 50px rgba(15,23,42,.16)"
                    }
                }
            }}
        >
            <Box>
                {/* -------------------------------------------------
                    HEADER
                ------------------------------------------------- */}
                <Box
                    sx={{
                        px: 1.5,
                        pt: 1.35,
                        pb: 1.1,
                        backgroundColor:
                            colors.header,
                        borderBottom:
                            `1px solid ${colors.border}`
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.9,
                                minWidth: 0
                            }}
                        >
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 0.9,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    backgroundColor:
                                        colors.primary,
                                    color: "#fff"
                                }}
                            >
                                <PaletteOutlined
                                    sx={{
                                        fontSize: 16
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    minWidth: 0
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        lineHeight: 1.15,
                                        fontWeight: 800,
                                        color:
                                            colors.text
                                    }}
                                >
                                    Schedule Appearance
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.25,
                                        fontSize: 8.5,
                                        lineHeight: 1.2,
                                        color:
                                            colors.muted
                                    }}
                                >
                                    Gantt and WBS visual settings
                                </Typography>
                            </Box>
                        </Box>

                        <Chip
                            label={presetLabel(
                                colorSettings.preset
                            )}
                            size="small"
                            sx={{
                                height: 19,
                                maxWidth: 112,
                                borderRadius: 0.7,
                                fontSize: 7.5,
                                fontWeight: 800,
                                letterSpacing:
                                    ".02em",
                                color:
                                    colors.primary,
                                backgroundColor:
                                    colors.primary +
                                    "14",
                                "& .MuiChip-label": {
                                    px: 0.8,
                                    overflow:
                                        "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap"
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* -------------------------------------------------
                    CONTENT
                ------------------------------------------------- */}
                <Box
                    sx={{
                        p: 1.35
                    }}
                >
                    {/* PRESET */}
                    <Box>
                        <Typography
                            sx={{
                                mb: 0.55,
                                fontSize: 8,
                                lineHeight: 1,
                                fontWeight: 800,
                                color: colors.muted,
                                letterSpacing:
                                    ".065em"
                            }}
                        >
                            COLOR PRESET
                        </Typography>

                        <Box
                            component="select"
                            value={
                                colorSettings.preset
                            }
                            onChange={event =>
                                setColorPreset(
                                    event.target
                                        .value as GanttColorPreset
                                )
                            }
                            sx={{
                                display: "block",
                                width: "100%",
                                height: 32,
                                px: 0.9,
                                border:
                                    `1px solid ${colors.border}`,
                                borderRadius: 0.75,
                                outline: "none",
                                backgroundColor:
                                    colors.surface,
                                color: colors.text,
                                fontFamily:
                                    "inherit",
                                fontSize: 9.5,
                                fontWeight: 650,
                                cursor: "pointer",
                                transition:
                                    "border-color .15s ease, box-shadow .15s ease",
                                "&:hover": {
                                    borderColor:
                                        colors.primary
                                },
                                "&:focus": {
                                    borderColor:
                                        colors.primary,
                                    boxShadow:
                                        `0 0 0 2px ${colors.primary}18`
                                }
                            }}
                        >
                            {PRESETS.map(
                                preset => (
                                    <option
                                        key={
                                            preset.value
                                        }
                                        value={
                                            preset.value
                                        }
                                    >
                                        {preset.label}
                                    </option>
                                )
                            )}
                        </Box>
                    </Box>

                    <Divider
                        sx={{
                            my: 1.25,
                            borderColor:
                                colors.border
                        }}
                    />

                    {/* COLOR GROUPS */}
                    {COLOR_GROUPS.map(
                        (
                            [groupTitle, items],
                            groupIndex
                        ) => (
                            <Box
                                key={
                                    groupTitle
                                }
                                sx={{
                                    mb:
                                        groupIndex <
                                        COLOR_GROUPS.length -
                                            1
                                            ? 1.15
                                            : 0
                                }}
                            >
                                <Typography
                                    sx={{
                                        mb: 0.65,
                                        fontSize: 8,
                                        lineHeight: 1,
                                        fontWeight: 800,
                                        color:
                                            colors.muted,
                                        letterSpacing:
                                            ".065em"
                                    }}
                                >
                                    {groupTitle}
                                </Typography>

                                <Box
                                    sx={{
                                        display:
                                            "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: 0.6
                                    }}
                                >
                                    {items.map(
                                        ([
                                            label,
                                            key
                                        ]) => {
                                            const value =
                                                customColors[
                                                    key
                                                ];

                                            return (
                                                <Box
                                                    key={
                                                        key
                                                    }
                                                    sx={{
                                                        height: 32,
                                                        px: 0.7,
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "space-between",
                                                        gap: 0.7,
                                                        border:
                                                            `1px solid ${colors.border}`,
                                                        borderRadius:
                                                            0.75,
                                                        backgroundColor:
                                                            colors.surface,
                                                        transition:
                                                            "background-color .15s ease, border-color .15s ease",
                                                        "&:hover":
                                                            {
                                                                backgroundColor:
                                                                    colors.hover,
                                                                borderColor:
                                                                    colors.primary +
                                                                    "55"
                                                            }
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 0.7,
                                                            minWidth:
                                                                0
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: 17,
                                                                height: 17,
                                                                flexShrink: 0,
                                                                borderRadius:
                                                                    key ===
                                                                    "milestone"
                                                                        ? "3px"
                                                                        : 0.55,
                                                                transform:
                                                                    key ===
                                                                    "milestone"
                                                                        ? "rotate(45deg)"
                                                                        : "none",
                                                                backgroundColor:
                                                                    value,
                                                                border:
                                                                    `1px solid rgba(15,23,42,.14)`,
                                                                boxShadow:
                                                                    "inset 0 0 0 1px rgba(255,255,255,.18)"
                                                            }}
                                                        />

                                                        <Typography
                                                            sx={{
                                                                minWidth:
                                                                    0,
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                fontSize: 9,
                                                                lineHeight:
                                                                    1,
                                                                fontWeight: 650,
                                                                color:
                                                                    colors.text
                                                            }}
                                                        >
                                                            {
                                                                label
                                                            }
                                                        </Typography>
                                                    </Box>

                                                    <Box
                                                        component="input"
                                                        type="color"
                                                        aria-label={`${label} color`}
                                                        value={
                                                            value
                                                        }
                                                        onChange={event =>
                                                            updateCustomColor(
                                                                key,
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        sx={{
                                                            width: 25,
                                                            height: 21,
                                                            p: 0.15,
                                                            flexShrink: 0,
                                                            border:
                                                                `1px solid ${colors.border}`,
                                                            borderRadius:
                                                                0.6,
                                                            backgroundColor:
                                                                colors.surface,
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    />
                                                </Box>
                                            );
                                        }
                                    )}
                                </Box>

                                {groupIndex <
                                    COLOR_GROUPS.length -
                                        1 && (
                                    <Divider
                                        sx={{
                                            mt: 1.15,
                                            borderColor:
                                                colors.border
                                        }}
                                    />
                                )}
                            </Box>
                        )
                    )}

                    {/* FOOTER */}
                    <Box
                        sx={{
                            mt: 1.25,
                            pt: 0.85,
                            borderTop:
                                `1px solid ${colors.border}`,
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between"
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 8,
                                color: colors.muted,
                                lineHeight: 1.25
                            }}
                        >
                            Custom colors are applied instantly.
                        </Typography>

                        <Box
                            component="button"
                            type="button"
                            onClick={resetColors}
                            sx={{
                                height: 27,
                                px: 0.85,
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: 0.45,
                                border: 0,
                                borderRadius: 0.65,
                                backgroundColor:
                                    "transparent",
                                color: colors.primary,
                                fontFamily:
                                    "inherit",
                                fontSize: 8.5,
                                fontWeight: 800,
                                cursor: "pointer",
                                transition:
                                    "background-color .15s ease",
                                "&:hover": {
                                    backgroundColor:
                                        colors.hover
                                }
                            }}
                        >
                            <RestartAltOutlined
                                sx={{
                                    fontSize: 13
                                }}
                            />

                            Reset
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Popover>
    );
}