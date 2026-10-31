import React, { useState } from "react";

import {
    Box,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Tooltip,
    Typography
} from "@mui/material";

import {
    AppsOutlined,
    FitScreen,
    SettingsOutlined,
    UnfoldLess,
    UnfoldMore,
    ViewColumnOutlined,
    ZoomIn,
    ZoomOut
} from "@mui/icons-material";

import { alpha } from "@mui/material/styles";

import {
    MAX_DAY_WIDTH,
    MIN_DAY_WIDTH,
    SCALE_OPTIONS
} from "../ganttConstants";

import type {
    GanttPalette,
    ScheduleRange,
    TimelineScale
} from "../ganttTypes";

import type { GanttExpansionLevel } from "../hooks/useGanttTree";

export interface GanttToolbarProps {
    colors: GanttPalette;

    effectiveWbsCount: number;

    scheduleRange: ScheduleRange;

    statusDateVisible: boolean;

    timelineScale: TimelineScale;
    setTimelineScale: React.Dispatch<React.SetStateAction<TimelineScale>>;

    columnsOpen: boolean;
    setColumnsAnchor: (element: HTMLElement | null) => void;

    allWbsIds: string[];

    expansionLevel: GanttExpansionLevel;
    maxWbsLevel: number;

    expandAll: () => void;
    collapseAll: () => void;
    expandToLevel: (level: number) => void;

    dayWidth: number;
    zoomIn: () => void;
    zoomOut: () => void;
    fitTimeline: () => void;

    /** Optional future entry point for the P6-style settings center. */
    onOpenSettings?: () => void;

    /** Optional future entry point for the application/view menu. */
    onOpenViewMenu?: () => void;
}

function ToolbarGroup({
    title,
    children,
    colors
}: {
    title: string;
    children: React.ReactNode;
    colors: GanttPalette;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.2,
                height: 34,
                px: 0.3,
                borderRadius: 0.8,
                backgroundColor: alpha(colors.background, 0.36),
                border: `1px solid ${alpha(colors.border, 0.72)}`
            }}
        >
            <Typography
                sx={{
                    px: 0.55,
                    fontSize: 7,
                    lineHeight: 1,
                    fontWeight: 800,
                    color: colors.muted,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    userSelect: "none"
                }}
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
}

export default function GanttToolbar({
    colors,

    effectiveWbsCount,
    scheduleRange,
    statusDateVisible,

    timelineScale,
    setTimelineScale,

    columnsOpen,
    setColumnsAnchor,

    allWbsIds = [],
    expansionLevel,
    maxWbsLevel,

    expandAll,
    collapseAll,
    expandToLevel,

    dayWidth,
    zoomIn,
    zoomOut,
    fitTimeline,

    onOpenSettings,
    onOpenViewMenu
}: GanttToolbarProps) {
    const [wbsMenuAnchor, setWbsMenuAnchor] = useState<HTMLElement | null>(null);
    const wbsMenuOpen = Boolean(wbsMenuAnchor);

    const openWbsMenu = (event: React.MouseEvent<HTMLElement>) => {
        setWbsMenuAnchor(event.currentTarget);
    };

    const closeWbsMenu = () => {
        setWbsMenuAnchor(null);
    };

    const levelLabel =
        expansionLevel === "all"
            ? "ALL"
            : expansionLevel === 0
              ? "L0"
              : `L${expansionLevel}`;

    const shellButtonSx = {
        width: 29,
        height: 29,
        borderRadius: 0.7,
        color: colors.muted,
        border: `1px solid transparent`,
        transition: "background-color .14s ease, border-color .14s ease, color .14s ease",
        "&:hover": {
            backgroundColor: alpha(colors.primary, 0.07),
            borderColor: alpha(colors.primary, 0.16),
            color: colors.primary
        },
        "&.Mui-disabled": {
            color: alpha(colors.muted, 0.35)
        }
    };

    const activeButtonSx = {
        ...shellButtonSx,
        backgroundColor: alpha(colors.primary, 0.09),
        borderColor: alpha(colors.primary, 0.18),
        color: colors.primary,
        "&:hover": {
            backgroundColor: alpha(colors.primary, 0.14),
            borderColor: alpha(colors.primary, 0.25),
            color: colors.primary
        }
    };

    const groupLabelSx = {
        px: 0.55,
        fontSize: 7,
        lineHeight: 1,
        fontWeight: 800,
        color: colors.muted,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        userSelect: "none" as const
    };

    return (
        <Box
            sx={{
                minHeight: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                gap: 0.45,
                px: 0.75,
                backgroundColor: colors.paper,
                borderBottom: `1px solid ${colors.border}`,
                color: colors.text,
                fontFamily: "Vazirmatn, Segoe UI, sans-serif",
                overflow: "hidden",
                direction: "ltr"
            }}
        >
            {/* =========================================================
             * VIEW IDENTITY
             * ========================================================= */}
            <Box
                sx={{
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.55,
                    mr: 0.25,
                    pr: 0.8,
                    borderRight: `1px solid ${colors.border}`
                }}
            >
                <Box
                    sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0.7,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        color: colors.primary,
                        backgroundColor: alpha(colors.primary, 0.08),
                        border: `1px solid ${alpha(colors.primary, 0.13)}`
                    }}
                >
                    <AppsOutlined sx={{ fontSize: 16 }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 9.5,
                            lineHeight: 1.05,
                            fontWeight: 800,
                            letterSpacing: "0.025em",
                            whiteSpace: "nowrap",
                            color: colors.text
                        }}
                    >
                        GANTT
                    </Typography>
                    <Typography
                        sx={{
                            mt: 0.15,
                            fontSize: 6.5,
                            lineHeight: 1,
                            color: colors.muted,
                            whiteSpace: "nowrap"
                        }}
                    >
                        {effectiveWbsCount} WBS
                        {scheduleRange.hasRealDates ? " • DATE BASED" : ""}
                    </Typography>
                </Box>
            </Box>

            {/* =========================================================
             * VIEW
             * ========================================================= */}
            <ToolbarGroup title="View" colors={colors}>
                <Tooltip title="Columns">
                    <IconButton
                        size="small"
                        onClick={event => setColumnsAnchor(event.currentTarget)}
                        sx={columnsOpen ? activeButtonSx : shellButtonSx}
                    >
                        <ViewColumnOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="View options">
                    <IconButton
                        size="small"
                        onClick={onOpenViewMenu}
                        sx={shellButtonSx}
                    >
                        <AppsOutlined sx={{ fontSize: 17 }} />
                    </IconButton>
                </Tooltip>
            </ToolbarGroup>

            <Divider orientation="vertical" flexItem sx={{ my: 0.8, borderColor: colors.border }} />

            {/* =========================================================
             * WBS
             * ========================================================= */}
            <ToolbarGroup title="WBS" colors={colors}>
                <Tooltip title="WBS expansion level">
                    <span>
                        <IconButton
                            size="small"
                            onClick={openWbsMenu}
                            disabled={allWbsIds.length === 0}
                            aria-haspopup="menu"
                            aria-expanded={wbsMenuOpen}
                            sx={wbsMenuOpen || expansionLevel !== "all" ? activeButtonSx : shellButtonSx}
                        >
                            {expansionLevel === 0 ? (
                                <UnfoldLess sx={{ fontSize: 18 }} />
                            ) : (
                                <UnfoldMore sx={{ fontSize: 18 }} />
                            )}
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography
                    sx={{
                        minWidth: 27,
                        textAlign: "center",
                        fontSize: 7.5,
                        fontWeight: 800,
                        color: expansionLevel === "all" ? colors.muted : colors.primary,
                        fontVariantNumeric: "tabular-nums"
                    }}
                >
                    {levelLabel}
                </Typography>
            </ToolbarGroup>

            <Menu
                anchorEl={wbsMenuAnchor}
                open={wbsMenuOpen}
                onClose={closeWbsMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            minWidth: 175,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 0.9,
                            boxShadow: "0 10px 28px rgba(15,23,42,.14)",
                            fontFamily: "Vazirmatn, Segoe UI, sans-serif"
                        }
                    }
                }}
            >
                <MenuItem
                    dense
                    onClick={() => {
                        collapseAll();
                        closeWbsMenu();
                    }}
                >
                    <UnfoldLess sx={{ mr: 1, fontSize: 18 }} />
                    Collapse All
                </MenuItem>
                <Divider />
                {Array.from({ length: Math.max(0, maxWbsLevel) }, (_, index) => index + 1).map(level => (
                    <MenuItem
                        key={level}
                        dense
                        selected={expansionLevel === level}
                        onClick={() => {
                            expandToLevel(level);
                            closeWbsMenu();
                        }}
                    >
                        <Typography
                            sx={{
                                width: 30,
                                fontSize: 8.5,
                                fontWeight: 800,
                                color: colors.primary
                            }}
                        >
                            L{level}
                        </Typography>
                        Level {level}
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem
                    dense
                    onClick={() => {
                        expandAll();
                        closeWbsMenu();
                    }}
                >
                    <UnfoldMore sx={{ mr: 1, fontSize: 18 }} />
                    Expand All
                </MenuItem>
            </Menu>

            <Divider orientation="vertical" flexItem sx={{ my: 0.8, borderColor: colors.border }} />

            {/* =========================================================
             * TIMESCALE
             * ========================================================= */}
            <ToolbarGroup title="Timescale" colors={colors}>
                <FormControl
                    size="small"
                    sx={{
                        minWidth: 90,
                        "& .MuiOutlinedInput-root": {
                            height: 29,
                            borderRadius: 0.7,
                            fontFamily: "Vazirmatn, Segoe UI, sans-serif",
                            fontSize: 8.5,
                            fontWeight: 700,
                            backgroundColor: colors.paper
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.border
                        },
                        "& .MuiSelect-select": {
                            py: 0.35,
                            px: 0.8
                        }
                    }}
                >
                    <InputLabel sx={{ display: "none" }}>Scale</InputLabel>
                    <Select
                        value={timelineScale}
                        onChange={event => setTimelineScale(event.target.value as TimelineScale)}
                        displayEmpty
                    >
                        {Object.entries(SCALE_OPTIONS).map(([value, label]) => (
                            <MenuItem
                                key={value}
                                value={value}
                                sx={{
                                    fontFamily: "Vazirmatn, Segoe UI, sans-serif",
                                    fontSize: 10
                                }}
                            >
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </ToolbarGroup>

            <Divider orientation="vertical" flexItem sx={{ my: 0.8, borderColor: colors.border }} />

            {/* =========================================================
             * ZOOM
             * ========================================================= */}
            <ToolbarGroup title="Zoom" colors={colors}>
                <Tooltip title="Zoom out">
                    <span>
                        <IconButton
                            size="small"
                            onClick={zoomOut}
                            disabled={dayWidth <= MIN_DAY_WIDTH}
                            sx={shellButtonSx}
                        >
                            <ZoomOut sx={{ fontSize: 18 }} />
                        </IconButton>
                    </span>
                </Tooltip>
                <Box
                    sx={{
                        minWidth: 34,
                        px: 0.2,
                        textAlign: "center"
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 8.5,
                            lineHeight: 1,
                            fontWeight: 800,
                            color: colors.text,
                            fontVariantNumeric: "tabular-nums"
                        }}
                    >
                        {Math.round(dayWidth)}
                    </Typography>
                    <Typography
                        sx={{
                            mt: 0.15,
                            fontSize: 6,
                            lineHeight: 1,
                            color: colors.muted,
                            textTransform: "uppercase"
                        }}
                    >
                        width
                    </Typography>
                </Box>
                <Tooltip title="Zoom in">
                    <span>
                        <IconButton
                            size="small"
                            onClick={zoomIn}
                            disabled={dayWidth >= MAX_DAY_WIDTH}
                            sx={shellButtonSx}
                        >
                            <ZoomIn sx={{ fontSize: 18 }} />
                        </IconButton>
                    </span>
                </Tooltip>
            </ToolbarGroup>

            <Tooltip title="Fit timeline">
                <IconButton
                    size="small"
                    onClick={fitTimeline}
                    sx={{
                        ...shellButtonSx,
                        ml: 0.1,
                        width: 31,
                        height: 31
                    }}
                >
                    <FitScreen sx={{ fontSize: 19 }} />
                </IconButton>
            </Tooltip>

            {/* =========================================================
             * RIGHT STATUS / SETTINGS
             * ========================================================= */}
            <Box
                sx={{
                    ml: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.35,
                    flexShrink: 0
                }}
            >
                {statusDateVisible && (
                    <Box
                        sx={{
                            height: 24,
                            px: 0.75,
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 0.65,
                            backgroundColor: alpha(colors.error, 0.055),
                            border: `1px solid ${alpha(colors.error, 0.13)}`
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 7,
                                fontWeight: 800,
                                letterSpacing: "0.045em",
                                color: colors.error
                            }}
                        >
                            DATA DATE
                        </Typography>
                    </Box>
                )}

                <Tooltip title="Gantt settings">
                    <IconButton
                        size="small"
                        onClick={onOpenSettings}
                        sx={shellButtonSx}
                    >
                        <SettingsOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
