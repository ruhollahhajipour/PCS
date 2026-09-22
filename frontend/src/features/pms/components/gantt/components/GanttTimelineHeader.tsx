import { Box, Typography } from "@mui/material";

import type { GanttPalette, TimelineUnit } from "../ganttTypes";

/* =========================================================
 * TYPES
 * ========================================================= */

interface GanttTimelineHeaderProps {
    colors: GanttPalette;
    width: number;
    units: TimelineUnit[];
    dayWidth: number;
    dateToX: (date: Date | null) => number;
    widthBetweenDates: (start: Date | null, end: Date | null) => number;
    fontFamily: string;
    fontSize: number;
    fontItalic: boolean;
    statusDate: Date | null;
    statusDateVisible: boolean;
    showDataDate?: boolean;
}

/* =========================================================
 * CONSTANTS
 * ========================================================= */

const GROUP_HEADER_HEIGHT = 22;
const UNIT_HEADER_HEIGHT = 28;
const TOTAL_HEADER_HEIGHT =
    GROUP_HEADER_HEIGHT + UNIT_HEADER_HEIGHT;

const MAJOR_BORDER_WIDTH = 2;
const MINOR_BORDER_WIDTH = 1;
const DAY_MS = 86_400_000;

/* =========================================================
 * DATE HELPERS
 * ========================================================= */

function startOfWeek(date: Date): Date {
    const day = date.getUTCDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + mondayOffset
        )
    );
}

function startOfMonth(date: Date): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            1
        )
    );
}

function startOfYear(date: Date): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            0,
            1
        )
    );
}

function addMonths(date: Date, months: number): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() + months,
            1
        )
    );
}

function addYears(date: Date, years: number): Date {
    return new Date(
        Date.UTC(
            date.getUTCFullYear() + years,
            0,
            1
        )
    );
}

function getMonthLabel(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    }).format(date);
}

function getMonthOnlyLabel(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "UTC"
    }).format(date);
}

function getYearLabel(date: Date): string {
    return String(date.getUTCFullYear());
}

function getDayLabel(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        timeZone: "UTC"
    }).format(date);
}

function getWeekNumber(date: Date): number {
    const weekStart = startOfWeek(date);
    const yearStart = startOfWeek(
        startOfYear(weekStart)
    );

    const diffDays = Math.round(
        (weekStart.getTime() - yearStart.getTime()) /
            DAY_MS
    );

    return Math.floor(diffDays / 7) + 1;
}

function getWeekLabel(date: Date): string {
    return `W${String(getWeekNumber(date)).padStart(2, "0")}`;
}

function getQuarterLabel(date: Date): string {
    const quarter =
        Math.floor(date.getUTCMonth() / 3) + 1;

    return `Q${quarter}`;
}

/* =========================================================
 * SCALE
 * ========================================================= */

type HeaderScale =
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";

function getHeaderScale(
    dayWidth: number,
    units: TimelineUnit[]
): HeaderScale {
    if (units.length >= 2) {
        const first = units[0];
        const second = units[1];

        const firstDuration =
            (first.end.getTime() - first.start.getTime()) /
            DAY_MS;

        const secondDuration =
            (second.end.getTime() - second.start.getTime()) /
            DAY_MS;

        const average =
            (firstDuration + secondDuration) / 2;

        if (average <= 1.5) return "day";
        if (average <= 10) return "week";
        if (average <= 100) return "month";
        if (average <= 370) return "quarter";

        return "year";
    }

    if (dayWidth >= 34) return "day";
    if (dayWidth >= 12) return "week";
    if (dayWidth >= 4) return "month";

    return "year";
}

/* =========================================================
 * VISUAL SIZES
 * ========================================================= */

function getUnitFontSize(
    fontSize: number,
    width: number,
    dayWidth: number
): number {
    if (width < 18) {
        return Math.max(7.5, fontSize - 1.3);
    }

    if (width < 28) {
        return Math.max(7.8, fontSize - 1);
    }

    if (width < 42) {
        return Math.max(8, fontSize - 0.55);
    }

    if (dayWidth > 42) {
        return Math.max(8.8, fontSize + 0.15);
    }

    return Math.max(8.4, fontSize);
}

function getMajorFontSize(
    fontSize: number,
    width: number
): number {
    if (width < 42) {
        return Math.max(7.8, fontSize - 0.8);
    }

    return Math.max(8.4, fontSize - 0.15);
}

function getMinimumMajorWidth(dayWidth: number): number {
    if (dayWidth < 12) return 30;
    if (dayWidth < 22) return 38;

    return 52;
}

function getMinimumUnitWidth(dayWidth: number): number {
    if (dayWidth < 15) return 12;
    if (dayWidth < 22) return 18;

    return 22;
}

/* =========================================================
 * RANGE
 * ========================================================= */

interface HeaderRange {
    start: Date;
    end: Date;
    label: string;
}

function buildRanges(
    units: TimelineUnit[],
    scale: HeaderScale
): HeaderRange[] {
    if (!units.length) return [];

    const first = units[0];
    const last = units[units.length - 1];
    const rangeStart = first.start;
    const rangeEnd = last.end;
    const ranges: HeaderRange[] = [];

    let cursor: Date;

    if (scale === "day" || scale === "week") {
        cursor = startOfMonth(rangeStart);

        while (cursor.getTime() < rangeEnd.getTime()) {
            const next = addMonths(cursor, 1);

            ranges.push({
                start: cursor,
                end: next,
                label: getMonthLabel(cursor)
            });

            cursor = next;
        }

        return ranges;
    }

    if (scale === "month" || scale === "quarter") {
        cursor = startOfYear(rangeStart);

        while (cursor.getTime() < rangeEnd.getTime()) {
            const next = addYears(cursor, 1);

            ranges.push({
                start: cursor,
                end: next,
                label: getYearLabel(cursor)
            });

            cursor = next;
        }

        return ranges;
    }

    cursor = startOfYear(rangeStart);

    while (cursor.getTime() < rangeEnd.getTime()) {
        const next = addYears(cursor, 1);

        ranges.push({
            start: cursor,
            end: next,
            label: getYearLabel(cursor)
        });

        cursor = next;
    }

    return ranges;
}

function getUnitDisplayLabel(
    unit: TimelineUnit,
    scale: HeaderScale
): string {
    switch (scale) {
        case "day":
            return getDayLabel(unit.start);
        case "week":
            return getWeekLabel(unit.start);
        case "month":
            return getMonthOnlyLabel(unit.start);
        case "quarter":
            return unit.label || getQuarterLabel(unit.start);
        case "year":
            return getYearLabel(unit.start);
        default:
            return unit.label;
    }
}

/* =========================================================
 * COMPONENT
 * ========================================================= */

export default function GanttTimelineHeader({
    colors,
    width,
    units,
    dayWidth,
    dateToX,
    widthBetweenDates,
    fontFamily,
    fontSize,
    fontItalic,
    statusDate,
    statusDateVisible,
    showDataDate = false
}: GanttTimelineHeaderProps) {
    const scale = getHeaderScale(dayWidth, units);

    const dataDateX =
        statusDate && statusDateVisible && showDataDate
            ? dateToX(statusDate)
            : null;

    const majorRanges = buildRanges(units, scale);
    const minimumMajorWidth = getMinimumMajorWidth(dayWidth);
    const minimumUnitWidth = getMinimumUnitWidth(dayWidth);

    const compact = dayWidth < 15;
    const dense = dayWidth < 22;

    const majorBackground = colors.header;
    const minorBackground = colors.surface;
    const majorBorder = colors.border;
    const minorBorder = colors.grid;

    return (
        <Box
            sx={{
                position: "relative",
                width,
                minWidth: width,
                height: TOTAL_HEADER_HEIGHT,
                minHeight: TOTAL_HEADER_HEIGHT,
                maxHeight: TOTAL_HEADER_HEIGHT,
                overflow: "hidden",
                boxSizing: "border-box",
                backgroundColor: colors.surface,
                borderTop: `1px solid ${colors.border}`,
                borderBottom: `2px solid ${colors.border}`,
                zIndex: 20,
                fontFamily,
                fontVariantNumeric: "tabular-nums",
                userSelect: "none"
            }}
        >
            {/* Major grouping row */}
            {majorRanges.map((range, index) => {
                const x = dateToX(range.start);
                const rangeWidth = Math.max(
                    1,
                    widthBetweenDates(range.start, range.end)
                );
                const showLabel =
                    rangeWidth >= minimumMajorWidth;

                return (
                    <Box
                        key={`major-${range.start.getTime()}-${index}`}
                        sx={{
                            position: "absolute",
                            left: x,
                            top: 0,
                            width: rangeWidth,
                            height: GROUP_HEADER_HEIGHT,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box",
                            px: compact ? 0.25 : 0.7,
                            backgroundColor: majorBackground,
                            borderRight:
                                `${MAJOR_BORDER_WIDTH}px solid ${majorBorder}`,
                            borderBottom:
                                `1px solid ${majorBorder}`,
                            overflow: "hidden",
                            zIndex: 4
                        }}
                    >
                        {showLabel && (
                            <Typography
                                component="span"
                                noWrap
                                sx={{
                                    width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textAlign: "center",
                                    fontFamily,
                                    fontSize: getMajorFontSize(
                                        fontSize,
                                        rangeWidth
                                    ),
                                    fontWeight: 750,
                                    lineHeight: 1,
                                    letterSpacing: "0.035em",
                                    color: colors.text,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {range.label}
                            </Typography>
                        )}
                    </Box>
                );
            })}

            {/* Minor unit row */}
            {units.map((unit, index) => {
                const x = dateToX(unit.start);
                const unitWidth = Math.max(
                    1,
                    widthBetweenDates(unit.start, unit.end)
                );

                const narrow = unitWidth < 36;
                const veryNarrow = unitWidth < 22;
                const showLabel = unitWidth >= minimumUnitWidth;
                const displayLabel = getUnitDisplayLabel(unit, scale);

                const previousUnit =
                    index > 0 ? units[index - 1] : null;

                const monthChanged = previousUnit
                    ? previousUnit.start.getUTCMonth() !==
                          unit.start.getUTCMonth() ||
                      previousUnit.start.getUTCFullYear() !==
                          unit.start.getUTCFullYear()
                    : true;

                const weekChanged = previousUnit
                    ? startOfWeek(previousUnit.start).getTime() !==
                      startOfWeek(unit.start).getTime()
                    : true;

                let borderRightWidth = MINOR_BORDER_WIDTH;
                let borderRightColor = minorBorder;

                if (monthChanged) {
                    borderRightWidth = MAJOR_BORDER_WIDTH;
                    borderRightColor = majorBorder;
                } else if (scale === "day" && weekChanged) {
                    borderRightWidth = 1.5;
                    borderRightColor = colors.border;
                }

                return (
                    <Box
                        key={`unit-${unit.start.getTime()}-${index}`}
                        sx={{
                            position: "absolute",
                            left: x,
                            top: GROUP_HEADER_HEIGHT,
                            width: unitWidth,
                            height: UNIT_HEADER_HEIGHT,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box",
                            px: veryNarrow
                                ? 0.05
                                : narrow
                                  ? 0.2
                                  : 0.5,
                            backgroundColor:
                                index % 2 === 0
                                    ? minorBackground
                                    : colors.zebra,
                            borderRight:
                                `${borderRightWidth}px solid ${borderRightColor}`,
                            borderTop:
                                `1px solid ${colors.gridLight}`,
                            overflow: "hidden",
                            zIndex: 2
                        }}
                    >
                        {showLabel && (
                            <Typography
                                component="span"
                                noWrap
                                sx={{
                                    display: "block",
                                    width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textAlign: "center",
                                    fontFamily,
                                    fontSize: getUnitFontSize(
                                        fontSize,
                                        unitWidth,
                                        dayWidth
                                    ),
                                    fontWeight: dense ? 700 : 650,
                                    fontStyle: fontItalic
                                        ? "italic"
                                        : "normal",
                                    lineHeight: 1,
                                    color: colors.text,
                                    letterSpacing: narrow
                                        ? "0"
                                        : "0.005em",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {displayLabel}
                            </Typography>
                        )}
                    </Box>
                );
            })}

            {/* Week guide lines for day scale */}
            {scale === "day" &&
                units.map((unit, index) => {
                    if (index === 0) return null;

                    const previousUnit = units[index - 1];
                    const currentWeek = startOfWeek(
                        unit.start
                    ).getTime();
                    const previousWeek = startOfWeek(
                        previousUnit.start
                    ).getTime();

                    if (currentWeek === previousWeek) {
                        return null;
                    }

                    const x = dateToX(unit.start);

                    return (
                        <Box
                            key={`week-guide-${unit.start.getTime()}`}
                            sx={{
                                position: "absolute",
                                left: x,
                                top: GROUP_HEADER_HEIGHT,
                                width: 1,
                                height: UNIT_HEADER_HEIGHT,
                                backgroundColor: colors.border,
                                opacity: 0.72,
                                pointerEvents: "none",
                                zIndex: 7
                            }}
                        />
                    );
                })}

            {/* Strong month boundaries */}
            {units.map((unit, index) => {
                const previous =
                    index > 0 ? units[index - 1] : null;

                const monthChanged =
                    !previous ||
                    previous.start.getUTCMonth() !==
                        unit.start.getUTCMonth() ||
                    previous.start.getUTCFullYear() !==
                        unit.start.getUTCFullYear();

                if (!monthChanged) return null;

                const x = dateToX(unit.start);

                return (
                    <Box
                        key={`month-boundary-${unit.start.getTime()}`}
                        sx={{
                            position: "absolute",
                            left: x,
                            top: 0,
                            width: 2,
                            height: "100%",
                            backgroundColor: colors.border,
                            opacity: 0.95,
                            pointerEvents: "none",
                            zIndex: 10
                        }}
                    />
                );
            })}

            {/* Data date */}
            {dataDateX !== null && (
                <>
                    <Box
                        sx={{
                            position: "absolute",
                            left: dataDateX,
                            top: 0,
                            width: 0,
                            height: "100%",
                            borderLeft:
                                `2px dashed ${colors.error}`,
                            zIndex: 30,
                            pointerEvents: "none",
                            filter:
                                "drop-shadow(0 0 1px rgba(0,0,0,0.18))"
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            left: dataDateX,
                            top: 1,
                            transform: "translateX(-50%)",
                            px: 0.75,
                            py: 0.3,
                            minWidth: 62,
                            height: 18,
                            borderRadius: 0.9,
                            backgroundColor: colors.error,
                            color: "#FFFFFF",
                            zIndex: 31,
                            pointerEvents: "none",
                            whiteSpace: "nowrap",
                            boxShadow:
                                "0 1px 4px rgba(15,23,42,.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box"
                        }}
                    >
                        <Typography
                            component="span"
                            sx={{
                                fontFamily,
                                fontSize: Math.max(
                                    7.2,
                                    fontSize - 0.55
                                ),
                                fontWeight: 800,
                                lineHeight: 1,
                                color: "#FFFFFF",
                                letterSpacing: "0.035em",
                                userSelect: "none"
                            }}
                        >
                            DATA DATE
                        </Typography>
                    </Box>
                </>
            )}

            {/* Baseline */}
            <Box
                sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 2,
                    backgroundColor: colors.border,
                    pointerEvents: "none",
                    zIndex: 40
                }}
            />
        </Box>
    );
}
