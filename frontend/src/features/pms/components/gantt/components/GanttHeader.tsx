import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef
} from "react";

import {
    Box,
    Typography
} from "@mui/material";

import type {
    GanttPalette,
    PmsColumnDefinition,
    PmsColumnKey
} from "../ganttTypes";

/* =========================================================
 * TYPES
 * ========================================================= */

interface GanttHeaderProps {
    colors: GanttPalette;

    columns: PmsColumnDefinition[];

    columnWidths: Record<
        PmsColumnKey,
        number
    >;

    alignments: Record<
        PmsColumnKey,
        "left" | "center" | "right"
    >;

    fontFamily: string;
    fontSize: number;
    fontItalic: boolean;

    onResize: (
        key: PmsColumnKey,
        delta: number
    ) => void;
}

/* =========================================================
 * GROUPS
 * ========================================================= */

type HeaderGroup =
    | "activity"
    | "schedule"
    | "progress"
    | "float"
    | "relationships"
    | "actual"
    | "constraints"
    | "cpm";

interface HeaderGroupSegment {
    group: HeaderGroup;
    label: string;
    width: number;
    startIndex: number;
    endIndex: number;
}

function getHeaderGroup(
    key: PmsColumnKey
): HeaderGroup {
    switch (key) {
        case "code":
        case "activity":
            return "activity";

        case "start":
        case "finish":
        case "duration":
        case "remaining":
            return "schedule";

        case "wf":
        case "wv":
        case "plannedProgress":
        case "actualProgress":
            return "progress";

        case "totalFloat":
        case "freeFloat":
            return "float";

        case "relationships":
        case "predecessors":
        case "successors":
            return "relationships";

        case "actualStart":
        case "actualFinish":
            return "actual";

        case "constraint":
        case "constraintDate":
            return "constraints";

        case "earlyStart":
        case "earlyFinish":
        case "lateStart":
        case "lateFinish":
        case "drivingFloat":
        case "critical":
            return "cpm";

        case "status":
        default:
            return "schedule";
    }
}

function getHeaderGroupLabel(
    group: HeaderGroup
): string {
    switch (group) {
        case "activity":
            return "ACTIVITY";
        case "schedule":
            return "SCHEDULE";
        case "progress":
            return "PROGRESS / VALUE";
        case "float":
            return "FLOAT";
        case "relationships":
            return "RELATIONSHIPS";
        case "actual":
            return "ACTUAL";
        case "constraints":
            return "CONSTRAINTS";
        case "cpm":
            return "CPM";
        default:
            return "";
    }
}

/* =========================================================
 * TYPOGRAPHY
 * ========================================================= */

function getHeaderFontSize(
    column: PmsColumnDefinition,
    baseSize: number
): number {
    if (
        column.key === "code" ||
        column.key === "duration" ||
        column.key === "wf" ||
        column.key === "wv" ||
        column.key === "totalFloat" ||
        column.key === "freeFloat"
    ) {
        return Math.max(
            8.0,
            baseSize - 0.75
        );
    }

    if (
        column.key === "start" ||
        column.key === "finish" ||
        column.key === "status" ||
        column.key === "remaining"
    ) {
        return Math.max(
            8.25,
            baseSize - 0.5
        );
    }

    if (column.key === "activity") {
        return Math.max(
            8.75,
            baseSize
        );
    }

    return Math.max(
        8.25,
        baseSize - 0.5
    );
}

function getHeaderFontWeight(
    column: PmsColumnDefinition
): number {
    if (column.key === "activity") {
        return 650;
    }

    if (
        column.key === "plannedProgress" ||
        column.key === "actualProgress"
    ) {
        return 650;
    }

    return 600;
}

function getHeaderLetterSpacing(
    column: PmsColumnDefinition
): string {
    if (
        column.key === "activity" ||
        column.key === "code"
    ) {
        return "0";
    }

    return "0.012em";
}

/* =========================================================
 * COMPONENT
 * ========================================================= */

export default function GanttHeader({
    colors,
    columns,
    columnWidths,
    alignments,
    fontFamily,
    fontSize,
    fontItalic,
    onResize
}: GanttHeaderProps) {
    const resizing =
        useRef<{
            key: PmsColumnKey;
            startX: number;
        } | null>(null);

    const groupSegments = useMemo<
        HeaderGroupSegment[]
    >(() => {
        const segments: HeaderGroupSegment[] = [];

        columns.forEach((column, index) => {
            const width =
                columnWidths[column.key] ??
                column.width;
            const group = getHeaderGroup(
                column.key
            );

            const last =
                segments[segments.length - 1];

            if (
                last &&
                last.group === group
            ) {
                last.width += width;
                last.endIndex = index;
            } else {
                segments.push({
                    group,
                    label:
                        getHeaderGroupLabel(
                            group
                        ),
                    width,
                    startIndex: index,
                    endIndex: index
                });
            }
        });

        return segments;
    }, [columns, columnWidths]);

    const handlePointerMove =
        useCallback(
            (event: PointerEvent) => {
                const state =
                    resizing.current;

                if (!state) {
                    return;
                }

                const delta =
                    event.clientX -
                    state.startX;

                if (delta === 0) {
                    return;
                }

                state.startX =
                    event.clientX;

                onResize(
                    state.key,
                    delta
                );
            },
            [onResize]
        );

    const stopResize =
        useCallback(() => {
            resizing.current =
                null;

            document.body.style.cursor =
                "";

            document.body.style.userSelect =
                "";
        }, []);

    useEffect(() => {
        document.addEventListener(
            "pointermove",
            handlePointerMove
        );

        document.addEventListener(
            "pointerup",
            stopResize
        );

        document.addEventListener(
            "pointercancel",
            stopResize
        );

        return () => {
            document.removeEventListener(
                "pointermove",
                handlePointerMove
            );

            document.removeEventListener(
                "pointerup",
                stopResize
            );

            document.removeEventListener(
                "pointercancel",
                stopResize
            );
        };
    }, [
        handlePointerMove,
        stopResize
    ]);

    const startResize =
        useCallback(
            (
                event: React.PointerEvent,
                key: PmsColumnKey
            ) => {
                if (event.button !== 0) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                resizing.current = {
                    key,
                    startX: event.clientX
                };

                document.body.style.cursor =
                    "col-resize";

                document.body.style.userSelect =
                    "none";

                try {
                    (
                        event.currentTarget as HTMLElement
                    ).setPointerCapture(
                        event.pointerId
                    );
                } catch {
                    /* Document listeners remain active. */
                }
            },
            []
        );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: 50,
                minHeight: 50,
                boxSizing: "border-box",
                backgroundColor:
                    colors.header,
                borderTop:
                    `1px solid ${colors.border}`,
                borderBottom:
                    `1px solid ${colors.border}`,
                overflow: "hidden",
                position: "relative",
                zIndex: 4,
                fontVariantNumeric:
                    "tabular-nums"
            }}
        >
            {/* =====================================================
             * P6-STYLE GROUP BAND
             * ===================================================== */}
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: 21,
                    minHeight: 21,
                    boxSizing: "border-box",
                    backgroundColor:
                        colors.subHeader,
                    borderBottom:
                        `1px solid ${colors.border}`,
                    overflow: "hidden"
                }}
            >
                {groupSegments.map(segment => (
                    <Box
                        key={`${segment.group}-${segment.startIndex}`}
                        sx={{
                            width: segment.width,
                            minWidth: segment.width,
                            maxWidth: segment.width,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 0.75,
                            boxSizing: "border-box",
                            borderRight:
                                `1px solid ${colors.border}`,
                            overflow: "hidden"
                        }}
                    >
                        <Typography
                            component="span"
                            noWrap
                            sx={{
                                maxWidth: "100%",
                                overflow: "hidden",
                                textOverflow:
                                    "ellipsis",
                                fontFamily,
                                fontSize: Math.max(
                                    7.75,
                                    fontSize - 1.5
                                ),
                                fontWeight: 700,
                                fontStyle:
                                    fontItalic
                                        ? "italic"
                                        : "normal",
                                letterSpacing:
                                    "0.04em",
                                lineHeight: 1,
                                color: colors.muted,
                                textTransform:
                                    "uppercase",
                                userSelect: "none"
                            }}
                        >
                            {segment.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* =====================================================
             * COLUMN BAND
             * ===================================================== */}
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: 29,
                    minHeight: 29,
                    boxSizing: "border-box",
                    backgroundColor:
                        colors.header,
                    overflow: "hidden"
                }}
            >
                {columns.map(column => {
                    const width =
                        columnWidths[
                            column.key
                        ] ?? column.width;

                    const alignment =
                        alignments[
                            column.key
                        ] ??
                        column.align ??
                        "left";

                    const justifyContent =
                        alignment === "right"
                            ? "flex-end"
                            : alignment ===
                                "center"
                                ? "center"
                                : "flex-start";

                    const isActivity =
                        column.key === "activity";

                    const isProgress =
                        column.key ===
                            "plannedProgress" ||
                        column.key ===
                            "actualProgress";

                    const isNumeric =
                        alignment === "right";

                    return (
                        <Box
                            key={column.key}
                            sx={{
                                position:
                                    "relative",
                                width,
                                minWidth: width,
                                maxWidth: width,
                                height: "100%",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent,
                                px: isActivity
                                    ? 0.9
                                    : isNumeric
                                        ? 0.6
                                        : 0.7,
                                boxSizing:
                                    "border-box",
                                borderRight:
                                    `1px solid ${colors.border}`,
                                backgroundColor:
                                    colors.header,
                                transition:
                                    "background-color 120ms ease",
                                "&:hover": {
                                    backgroundColor:
                                        colors.hover
                                }
                            }}
                        >
                            <Typography
                                component="span"
                                noWrap
                                sx={{
                                    width: "100%",
                                    minWidth: 0,
                                    overflow:
                                        "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    textAlign:
                                        alignment,
                                    fontFamily,
                                    fontSize: `${getHeaderFontSize(
                                        column,
                                        fontSize
                                    )}px`,
                                    fontWeight:
                                        getHeaderFontWeight(
                                            column
                                        ),
                                    fontStyle:
                                        fontItalic
                                            ? "italic"
                                            : "normal",
                                    letterSpacing:
                                        getHeaderLetterSpacing(
                                            column
                                        ),
                                    lineHeight: 1.05,
                                    color:
                                        isProgress
                                            ? colors.primary
                                            : colors.text,
                                    fontVariantNumeric:
                                        "tabular-nums",
                                    transform:
                                        isNumeric
                                            ? "translateY(-0.15px)"
                                            : "none",
                                    userSelect:
                                        "none"
                                }}
                            >
                                {column.label}
                            </Typography>

                            {/* Column resize handle */}
                            <Box
                                role="separator"
                                aria-orientation="vertical"
                                aria-label={`Resize ${column.label}`}
                                onPointerDown={event =>
                                    startResize(
                                        event,
                                        column.key
                                    )
                                }
                                sx={{
                                    position:
                                        "absolute",
                                    top: 0,
                                    right: -3,
                                    width: 7,
                                    height: "100%",
                                    cursor:
                                        "col-resize",
                                    zIndex: 10,
                                    touchAction:
                                        "none",
                                    "&::after": {
                                        content:
                                            '""',
                                        position:
                                            "absolute",
                                        top: 5,
                                        bottom: 5,
                                        left: 3,
                                        width: 1,
                                        borderRadius: 1,
                                        backgroundColor:
                                            "transparent",
                                        transition:
                                            "background-color 120ms ease"
                                    },
                                    "&:hover::after": {
                                        backgroundColor:
                                            colors.primary
                                    },
                                    "&:active::after": {
                                        backgroundColor:
                                            colors.primary
                                    }
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
