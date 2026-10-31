import React, { useState } from "react";
import {
    Box,
    Divider,
    IconButton,
    MenuItem,
    Paper,
    Popover,
    Select,
    Tooltip,
    Typography
} from "@mui/material";

import type {
    SelectChangeEvent
} from "@mui/material";

import FormatSizeOutlinedIcon from "@mui/icons-material/FormatSizeOutlined";
import FormatAlignLeftOutlinedIcon from "@mui/icons-material/FormatAlignLeftOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export type GanttHorizontalAlignment =
    | "left"
    | "center"
    | "right";

export type GanttFontSize =
    | "11"
    | "12"
    | "13"
    | "14";

export type GanttFontFamily =
    | "Vazirmatn"
    | "Segoe UI"
    | "Tahoma"
    | "Arial";

export type GanttDensity =
    | "compact"
    | "comfortable"
    | "spacious";

export interface GanttSettingsToolbarProps {
    fontFamily?: GanttFontFamily;

    onFontFamilyChange?: (
        value: GanttFontFamily
    ) => void;

    fontSize?: GanttFontSize;

    onFontSizeChange?: (
        value: GanttFontSize
    ) => void;

    alignment?: GanttHorizontalAlignment;

    onAlignmentChange?: (
        value: GanttHorizontalAlignment
    ) => void;

    gridVisible?: boolean;

    onGridVisibleChange?: (
        value: boolean
    ) => void;

    density?: GanttDensity;

    onDensityChange?: (
        value: GanttDensity
    ) => void;

    zoom?: number;

    onZoomChange?: (
        value: number
    ) => void;

    minZoom?: number;

    maxZoom?: number;

    zoomStep?: number;
}

type SettingsPopover =
    | "font"
    | "alignment"
    | "grid"
    | "density"
    | null;

const FONT_FAMILIES: {
    value: GanttFontFamily;
    label: string;
}[] = [
    {
        value: "Vazirmatn",
        label: "Vazirmatn"
    },
    {
        value: "Segoe UI",
        label: "Segoe UI"
    },
    {
        value: "Tahoma",
        label: "Tahoma"
    },
    {
        value: "Arial",
        label: "Arial"
    }
];

const FONT_SIZES: GanttFontSize[] = [
    "11",
    "12",
    "13",
    "14"
];

export default function GanttSettingsToolbar(
    props: GanttSettingsToolbarProps
) {
    const {
        fontFamily = "Vazirmatn",
        onFontFamilyChange,

        fontSize = "12",
        onFontSizeChange,

        alignment = "left",
        onAlignmentChange,

        gridVisible = true,
        onGridVisibleChange,

        density = "comfortable",
        onDensityChange,

        zoom = 100,
        onZoomChange,

        minZoom = 50,
        maxZoom = 250,
        zoomStep = 10
    } = props;

    const [
        anchorEl,
        setAnchorEl
    ] = useState<HTMLElement | null>(null);

    const [
        activePopover,
        setActivePopover
    ] = useState<SettingsPopover>(null);

    const openPopover = (
        event: React.MouseEvent<HTMLElement>,
        type: SettingsPopover
    ) => {
        setAnchorEl(event.currentTarget);
        setActivePopover(type);
    };

    const closePopover = () => {
        setAnchorEl(null);
        setActivePopover(null);
    };

    const handleFontFamilyChange = (
        event: SelectChangeEvent
    ) => {
        onFontFamilyChange?.(
            event.target.value as GanttFontFamily
        );
    };

    const handleFontSizeChange = (
        event: SelectChangeEvent
    ) => {
        onFontSizeChange?.(
            event.target.value as GanttFontSize
        );
    };

    const handleAlignmentChange = (
        event: SelectChangeEvent
    ) => {
        onAlignmentChange?.(
            event.target.value as GanttHorizontalAlignment
        );
    };

    const handleDensityChange = (
        event: SelectChangeEvent
    ) => {
        onDensityChange?.(
            event.target.value as GanttDensity
        );
    };

    const handleZoomChange = (
        delta: number
    ) => {
        const next = Math.min(
            maxZoom,
            Math.max(
                minZoom,
                zoom + delta
            )
        );

        onZoomChange?.(next);
    };

    const buttonSx = {
        width: 34,
        height: 34,
        borderRadius: 1.15,

        color: "text.secondary",

        border: "1px solid",
        borderColor: "rgba(100, 116, 139, 0.24)",

        backgroundColor: "rgba(248, 250, 252, 0.92)",

        transition:
            "color .16s ease, background-color .16s ease, border-color .16s ease",

        "&:hover": {
            color: "primary.main",
            backgroundColor:
                "rgba(37, 99, 235, 0.055)",
            borderColor:
                "rgba(37, 99, 235, 0.38)"
        },

        "&.Mui-disabled": {
            color:
                "rgba(100, 116, 139, 0.35)",
            borderColor:
                "rgba(100, 116, 139, 0.14)"
        }
    };

    const activeButtonSx = {
        ...buttonSx,

        color: "primary.main",

        backgroundColor:
            "rgba(37, 99, 235, 0.075)",

        borderColor:
            "rgba(37, 99, 235, 0.42)"
    };

    const popoverPaperSx = {
        p: 1.5,

        minWidth: 260,

        borderRadius: 1.5,

        border:
            "1px solid rgba(100, 116, 139, 0.18)",

        boxShadow:
            "0 12px 32px rgba(15, 23, 42, 0.12)",

        backgroundColor:
            "#FFFFFF"
    };

    const selectSx = {
        width: "100%",
        height: 38,

        "& .MuiSelect-select": {
            py: 0.75,
            fontSize: 13
        }
    };

    const isOpen = (
        type: Exclude<
            SettingsPopover,
            null
        >
    ) =>
        activePopover === type;

    return (
        <>
            {/* =====================================================
             * VIEW SETTINGS TOOLBAR
             * ===================================================== */}
            <Paper
                elevation={0}
                sx={{
                    mx: 0.5,
                    mb: 0.65,

                    minHeight: 42,

                    px: 0.85,
                    py: 0.55,

                    display: "flex",
                    alignItems: "center",

                    gap: 0.65,

                    border:
                        "1px solid rgba(100, 116, 139, 0.20)",

                    borderRadius: 1,

                    backgroundColor:
                        "rgba(248, 250, 252, 0.78)",

                    direction: "ltr",

                    overflowX: "auto",

                    scrollbarWidth: "thin"
                }}
            >
                {/* -------------------------------------------------
                 * FONT
                 * ------------------------------------------------- */}
                <Tooltip title="Font">
                    <IconButton
                        size="small"
                        onClick={event =>
                            openPopover(
                                event,
                                "font"
                            )
                        }
                        sx={
                            isOpen("font")
                                ? activeButtonSx
                                : buttonSx
                        }
                    >
                        <FormatSizeOutlinedIcon
                            sx={{
                                fontSize: 19
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* -------------------------------------------------
                 * ALIGNMENT
                 * ------------------------------------------------- */}
                <Tooltip title="Alignment">
                    <IconButton
                        size="small"
                        onClick={event =>
                            openPopover(
                                event,
                                "alignment"
                            )
                        }
                        sx={
                            isOpen("alignment")
                                ? activeButtonSx
                                : buttonSx
                        }
                    >
                        <FormatAlignLeftOutlinedIcon
                            sx={{
                                fontSize: 19
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* -------------------------------------------------
                 * GRID
                 * ------------------------------------------------- */}
                <Tooltip title="Grid">
                    <IconButton
                        size="small"
                        onClick={event =>
                            openPopover(
                                event,
                                "grid"
                            )
                        }
                        sx={
                            isOpen("grid")
                                ? activeButtonSx
                                : buttonSx
                        }
                    >
                        <GridOnOutlinedIcon
                            sx={{
                                fontSize: 19
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* -------------------------------------------------
                 * DENSITY
                 * ------------------------------------------------- */}
                <Tooltip title="Row Density">
                    <IconButton
                        size="small"
                        onClick={event =>
                            openPopover(
                                event,
                                "density"
                            )
                        }
                        sx={
                            isOpen("density")
                                ? activeButtonSx
                                : buttonSx
                        }
                    >
                        <DensityMediumOutlinedIcon
                            sx={{
                                fontSize: 19
                            }}
                        />
                    </IconButton>
                </Tooltip>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        mx: 0.45,
                        borderColor:
                            "rgba(100, 116, 139, 0.20)"
                    }}
                />

                {/* -------------------------------------------------
                 * ZOOM OUT
                 * ------------------------------------------------- */}
                <Tooltip title="Zoom Out">
                    <IconButton
                        size="small"
                        onClick={() =>
                            handleZoomChange(
                                -zoomStep
                            )
                        }
                        disabled={
                            zoom <= minZoom
                        }
                        sx={buttonSx}
                    >
                        <RemoveOutlinedIcon
                            sx={{
                                fontSize: 18
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* -------------------------------------------------
                 * ZOOM VALUE
                 * ------------------------------------------------- */}
                <Box
                    sx={{
                        minWidth: 54,
                        px: 0.55,

                        height: 34,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        border:
                            "1px solid rgba(100, 116, 139, 0.16)",

                        borderRadius: 1,

                        backgroundColor:
                            "rgba(255,255,255,.88)"
                    }}
                >
                    <Typography
                        component="span"
                        sx={{
                            fontSize: 11.5,
                            fontWeight: 750,
                            color:
                                "text.secondary",
                            lineHeight: 1,
                            fontVariantNumeric:
                                "tabular-nums"
                        }}
                    >
                        {zoom}%
                    </Typography>
                </Box>

                {/* -------------------------------------------------
                 * ZOOM IN
                 * ------------------------------------------------- */}
                <Tooltip title="Zoom In">
                    <IconButton
                        size="small"
                        onClick={() =>
                            handleZoomChange(
                                zoomStep
                            )
                        }
                        disabled={
                            zoom >= maxZoom
                        }
                        sx={buttonSx}
                    >
                        <AddOutlinedIcon
                            sx={{
                                fontSize: 18
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Paper>

            {/* =====================================================
             * FONT POPOVER
             * ===================================================== */}
            <Popover
                open={isOpen("font")}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                slotProps={{
                    paper: {
                        sx: popoverPaperSx
                    }
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "text.primary",
                        mb: 1.35
                    }}
                >
                    PMS Font
                </Typography>

                <Typography
                    component="label"
                    sx={{
                        display: "block",
                        mb: 0.55,

                        fontSize: 11.5,
                        fontWeight: 650,

                        color:
                            "text.secondary"
                    }}
                >
                    Font Family
                </Typography>

                <Select
                    value={fontFamily}
                    onChange={
                        handleFontFamilyChange
                    }
                    size="small"
                    sx={{
                        ...selectSx,
                        mb: 1.25
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 300
                            }
                        }
                    }}
                >
                    {FONT_FAMILIES.map(
                        font => (
                            <MenuItem
                                key={
                                    font.value
                                }
                                value={
                                    font.value
                                }
                                sx={{
                                    fontFamily:
                                        font.value,
                                    fontSize: 13
                                }}
                            >
                                {font.label}
                            </MenuItem>
                        )
                    )}
                </Select>

                <Typography
                    component="label"
                    sx={{
                        display: "block",
                        mb: 0.55,

                        fontSize: 11.5,
                        fontWeight: 650,

                        color:
                            "text.secondary"
                    }}
                >
                    Font Size
                </Typography>

                <Select
                    value={fontSize}
                    onChange={
                        handleFontSizeChange
                    }
                    size="small"
                    sx={selectSx}
                >
                    {FONT_SIZES.map(
                        size => (
                            <MenuItem
                                key={size}
                                value={size}
                                sx={{
                                    fontSize:
                                        Number(
                                            size
                                        )
                                }}
                            >
                                {size}px
                            </MenuItem>
                        )
                    )}
                </Select>
            </Popover>

            {/* =====================================================
             * ALIGNMENT POPOVER
             * ===================================================== */}
            <Popover
                open={isOpen("alignment")}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                slotProps={{
                    paper: {
                        sx: popoverPaperSx
                    }
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "text.primary",
                        mb: 1.1
                    }}
                >
                    Text Alignment
                </Typography>

                <Select
                    value={alignment}
                    onChange={
                        handleAlignmentChange
                    }
                    size="small"
                    sx={selectSx}
                >
                    <MenuItem value="left">
                        Left
                    </MenuItem>

                    <MenuItem value="center">
                        Center
                    </MenuItem>

                    <MenuItem value="right">
                        Right
                    </MenuItem>
                </Select>
            </Popover>

            {/* =====================================================
             * GRID POPOVER
             * ===================================================== */}
            <Popover
                open={isOpen("grid")}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                slotProps={{
                    paper: {
                        sx: popoverPaperSx
                    }
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "text.primary",
                        mb: 1
                    }}
                >
                    Grid
                </Typography>

                <Box
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                        onGridVisibleChange?.(
                            !gridVisible
                        )
                    }
                    onKeyDown={event => {
                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {
                            event.preventDefault();

                            onGridVisibleChange?.(
                                !gridVisible
                            );
                        }
                    }}
                    sx={{
                        minHeight: 42,

                        px: 1.15,

                        borderRadius: 1,

                        cursor: "pointer",

                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",

                        backgroundColor:
                            gridVisible
                                ? "rgba(37, 99, 235, 0.065)"
                                : "transparent",

                        border:
                            "1px solid",
                        borderColor:
                            gridVisible
                                ? "rgba(37, 99, 235, 0.16)"
                                : "transparent",

                        transition:
                            "background-color .15s ease, border-color .15s ease",

                        "&:hover": {
                            backgroundColor:
                                "rgba(37, 99, 235, 0.055)"
                        }
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 12.5,
                            fontWeight: 550
                        }}
                    >
                        Show Grid
                    </Typography>

                    <Box
                        sx={{
                            width: 9,
                            height: 9,

                            borderRadius:
                                "50%",

                            backgroundColor:
                                gridVisible
                                    ? "success.main"
                                    : "action.disabled"
                        }}
                    />
                </Box>
            </Popover>

            {/* =====================================================
             * DENSITY POPOVER
             * ===================================================== */}
            <Popover
                open={isOpen("density")}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                slotProps={{
                    paper: {
                        sx: popoverPaperSx
                    }
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: 14,
                        color: "text.primary",
                        mb: 1.1
                    }}
                >
                    Row Density
                </Typography>

                <Select
                    value={density}
                    onChange={
                        handleDensityChange
                    }
                    size="small"
                    sx={selectSx}
                >
                    <MenuItem value="compact">
                        Compact
                    </MenuItem>

                    <MenuItem value="comfortable">
                        Comfortable
                    </MenuItem>

                    <MenuItem value="spacious">
                        Spacious
                    </MenuItem>
                </Select>
            </Popover>
        </>
    );
}