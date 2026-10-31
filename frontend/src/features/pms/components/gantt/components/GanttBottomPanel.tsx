import type { ReactNode } from "react";

import {
    Box,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";

import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    SettingsOutlined,
    ViewColumn
} from "@mui/icons-material";

import type {
    GanttPalette,
    PmsColumnDefinition,
    PmsColumnKey,
    PmsColumnStyle
} from "../ganttTypes";

type ColumnAlignment =
    | "left"
    | "center"
    | "right";

interface GanttBottomPanelProps {
    colors: GanttPalette;
    rowHeight: number;
    collapsed: boolean;
    height: number;

    gridSettingsOpen?: boolean;
    onToggleGrid?: () => void;

    onDecreaseRowHeight?: () => void;
    onIncreaseRowHeight?: () => void;
    onResetRowHeight?: () => void;
    onRowHeightChange?: (value: number) => void;

    visibleColumns?: PmsColumnDefinition[];
    selectedColumnKey?: PmsColumnKey | null;

    setSelectedColumn?: (
        key: PmsColumnKey
    ) => void;

    columnWidths?: Partial<
        Record<PmsColumnKey, number>
    >;

    setColumnWidth?: (
        key: PmsColumnKey,
        width: number
    ) => void;

    columnAlignments?: Partial<
        Record<PmsColumnKey, ColumnAlignment>
    >;

    setColumnAlignment?: (
        key: PmsColumnKey,
        alignment: ColumnAlignment
    ) => void;

    columnStyles?: Partial<
        Record<PmsColumnKey, PmsColumnStyle>
    >;

    setColumnStyle?: (
        key: PmsColumnKey,
        patch: Partial<PmsColumnStyle>
    ) => void;

    resetColumnStyle?: (
        key: PmsColumnKey
    ) => void;

    onResetColumns?: () => void;

    onResize?: (
        event: React.PointerEvent
    ) => void;

    onTogglePmsControl?: () => void;

    controlPanel?: ReactNode;
}

const FONT_STACK =
    "Vazirmatn, Segoe UI, Inter, Roboto, Arial, sans-serif";

/*
 * Compact fixed control bar.
 *
 * The control area is intentionally kept small so the
 * professional PMS remains the dominant visual surface.
 */
const HEADER_HEIGHT = 34;

const PANEL_BORDER =
    "1px solid rgba(209, 217, 228, 0.3)";

export default function GanttBottomPanel({
    colors,
    rowHeight,
    collapsed,
    height,
    gridSettingsOpen = false,
    onToggleGrid,
    onResize,
    onTogglePmsControl,
    controlPanel
}: GanttBottomPanelProps) {
    const panelHeight = collapsed
        ? HEADER_HEIGHT
        : Math.max(
            HEADER_HEIGHT,
            height
        );

    return (
        <Box
            sx={{
                position: "relative",

                width: "100%",

                height: panelHeight,
                minHeight: panelHeight,
                maxHeight: panelHeight,

                flexShrink: 0,

                display: "flex",
                flexDirection: "column",

                backgroundColor:
                    colors.surface,

                borderTop:
                    PANEL_BORDER,

                boxSizing:
                    "border-box",

                overflow: "hidden",

                fontFamily:
                    FONT_STACK,

                fontVariantNumeric:
                    "tabular-nums",

                transition:
                    "height 180ms ease"
            }}
        >
            {/* =====================================================
             * RESIZE HANDLE
             * ===================================================== */}

            {!collapsed && onResize && (
                <Box
                    onPointerDown={onResize}
                    sx={{
                        position: "absolute",

                        top: -5,
                        left: 0,
                        right: 0,

                        height: 10,

                        cursor: "row-resize",

                        zIndex: 50,

                        touchAction: "none",

                        "&::after": {
                            content: '""',

                            position: "absolute",

                            left: "50%",
                            top: 3,

                            transform:
                                "translateX(-50%)",

                            width: 42,
                            height: 3,

                            borderRadius: 3,

                            backgroundColor:
                                colors.border,

                            transition:
                                "width 140ms ease, background-color 140ms ease"
                        },

                        "&:hover::after": {
                            width: 68,

                            backgroundColor:
                                colors.primary
                        }
                    }}
                />
            )}

            {/* =====================================================
             * COMPACT CONTROL BAR
             * ===================================================== */}

            <Box
                sx={{
                    height:
                        HEADER_HEIGHT,

                    minHeight:
                        HEADER_HEIGHT,

                    flexShrink: 0,

                    px: 1,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    gap: 1,

                    backgroundColor:
                        colors.header,

                    borderBottom:
                        collapsed
                            ? "none"
                            : `1px solid ${colors.border}`,

                    boxShadow:
                        collapsed
                            ? "0 -2px 8px rgba(152, 182, 223, 0.08)"
                            : "none",

                    userSelect:
                        "none"
                }}
            >
                {/* LEFT */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems:
                            "center",

                        gap: 0.65,

                        minWidth: 0,

                        overflow: "hidden"
                    }}
                >
                    {/* Accent */}

                    <Box
                        sx={{
                            width: 3,
                            height: 18,

                            flexShrink: 0,

                            borderRadius: 2,

                            backgroundColor:
                                colors.primary
                        }}
                    />

                    {/* Icon */}

                    <Box
                        sx={{
                            width: 24,
                            height: 24,

                            flexShrink: 0,

                            display: "flex",

                            alignItems:
                                "right",

                            justifyContent:
                                "center",

                            borderRadius: 0.8,

                            backgroundColor:
                                colors.selected
                        }}
                    >
                        <SettingsOutlined
                            sx={{
                                fontSize: 15,

                                color:
                                    colors.primary
                            }}
                        />
                    </Box>

                    {/* Title */}

                    <Typography
                        sx={{
                            fontFamily:
                                FONT_STACK,

                            fontSize: 10.5,

                            fontWeight: 800,

                            color:
                                colors.text,

                            letterSpacing:
                                "0.035em",

                            lineHeight: 1,

                            whiteSpace:
                                "nowrap"
                        }}
                    >
                        PMS CONTROL
                    </Typography>

                    {/* Program badge */}

                    <Box
                        sx={{
                            px: 0.7,
                            py: 0.2,

                            borderRadius: 0.6,

                            backgroundColor:
                                colors.primary,

                            color:
                                "#FFFFFF",

                            fontFamily:
                                FONT_STACK,

                            fontSize: 7.5,

                            fontWeight: 800,

                            lineHeight: 1.3,

                            letterSpacing:
                                "0.04em",

                            whiteSpace:
                                "nowrap"
                        }}
                    >
                        PROGRAM
                    </Box>

                    {/* Row indicator */}

                    <Box
                        sx={{
                            display: "flex",

                            alignItems:
                                "center",

                            gap: 0.35,

                            px: 0.65,
                            py: 0.18,

                            borderRadius: 0.6,

                            backgroundColor:
                                colors.surface,

                            border:
                                `1px solid ${colors.border}`
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily:
                                    FONT_STACK,

                                fontSize: 7.5,

                                fontWeight: 600,

                                color:
                                    colors.muted,

                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            ROW
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily:
                                    FONT_STACK,

                                fontSize: 8.5,

                                fontWeight: 800,

                                color:
                                    colors.text,

                                whiteSpace:
                                    "nowrap"
                            }}
                        >
                            {rowHeight}px
                        </Typography>
                    </Box>
                </Box>

                {/* RIGHT ACTIONS */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems:
                            "center",

                        gap: 0.25,

                        flexShrink: 0
                    }}
                >
                    {onToggleGrid && (
                        <Tooltip
                            title={
                                gridSettingsOpen
                                    ? "Close Grid Settings"
                                    : "Grid & Appearance"
                            }
                        >
                            <IconButton
                                size="small"
                                onClick={
                                    onToggleGrid
                                }
                                sx={{
                                    width: 28,
                                    height: 28,

                                    borderRadius:
                                        0.8,

                                    color:
                                        gridSettingsOpen
                                            ? colors.primary
                                            : colors.muted,

                                    backgroundColor:
                                        gridSettingsOpen
                                            ? colors.selected
                                            : "transparent",

                                    "&:hover": {
                                        color:
                                            colors.primary,

                                        backgroundColor:
                                            colors.hover
                                    }
                                }}
                            >
                                <ViewColumn
                                    sx={{
                                        fontSize: 17
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    )}

                    {onTogglePmsControl && (
                        <Tooltip
                            title={
                                collapsed
                                    ? "Show PMS Control"
                                    : "Hide PMS Control"
                            }
                        >
                            <IconButton
                                size="small"
                                onClick={
                                    onTogglePmsControl
                                }
                                aria-label={
                                    collapsed
                                        ? "Show PMS Control"
                                        : "Hide PMS Control"
                                }
                                sx={{
                                    width: 28,
                                    height: 28,

                                    borderRadius:
                                        0.8,

                                    color:
                                        collapsed
                                            ? colors.primary
                                            : colors.muted,

                                    backgroundColor:
                                        collapsed
                                            ? colors.selected
                                            : "transparent",

                                    "&:hover": {
                                        color:
                                            colors.primary,

                                        backgroundColor:
                                            colors.hover
                                    }
                                }}
                            >
                                {collapsed ? (
                                    <KeyboardArrowUp
                                        sx={{
                                            fontSize: 19
                                        }}
                                    />
                                ) : (
                                    <KeyboardArrowDown
                                        sx={{
                                            fontSize: 19
                                        }}
                                    />
                                )}
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            {/* =====================================================
             * CONTROL CONTENT
             * ===================================================== */}

            {!collapsed && (
                <Box
                    sx={{
                        flex:
                            "1 1 auto",

                        minHeight: 0,
                        minWidth: 0,

                        overflow: "hidden",

                        backgroundColor:
                            colors.surface
                    }}
                >
                    {controlPanel}
                </Box>
            )}
        </Box>
    );
}