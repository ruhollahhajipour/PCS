import { useCallback, useMemo } from "react";

import type { GanttRow } from "../../../api/ganttApi";

import type {
    GanttCustomColors,
    ScheduleRange,
    TimelineScale,
    TimelineUnit
} from "../ganttTypes";

import {
    clamp,
    getProjectScheduleRange,
    getTimelineUnits
} from "../ganttUtils";

/* =========================================================
 * TYPES
 * ========================================================= */

export interface UseGanttTimelineResult {
    scheduleRange: ScheduleRange;
    timelineUnits: TimelineUnit[];
    rangeDays: number;
    timelineWidth: number;
    dateToX: (date: Date | null) => number;
    widthBetweenDates: (
        start: Date | null,
        end: Date | null
    ) => number;
    getWbsColor: (level: number) => string;
}

/* =========================================================
 * CONSTANTS
 * ========================================================= */

const DAY_MS = 86_400_000;
const MIN_TIMELINE_WIDTH = 480;
const TIMELINE_END_PADDING_DAYS = 2;

const DEFAULT_WBS_COLORS: GanttCustomColors = {
    wbsLevel1: "#2563EB",
    wbsLevel2: "#475569",
    wbsLevel3: "#64748B",
    wbsLevel4: "#94A3B8",
    wbsLevel5: "#3F74C9",
    wbsLevel6: "#60708A",
    wbsLevel7: "#74889B",
    wbsLevel8: "#A8B5C0",
    wbsLevel9: "#467FCB",
    wbsLevel10: "#67768F",
    wbsLevel11: "#7D8F9F",
    wbsLevel12: "#BCC6CF",
    wbsLevel13: "#4F89CF",
    wbsLevel14: "#6E7C94",
    wbsLevel15: "#8797A7",
    wbsLevel16: "#CAD1D8",
    wbsLevel17: "#5A92D4",
    wbsLevel18: "#75849B",
    wbsLevel19: "#91A0AF",
    wbsLevel20: "#D8DEE3",
    activity: "#CBD5E1",
    critical: "#DC2626",
    milestone: "#7C3AED"
};

/* =========================================================
 * HELPERS
 * ========================================================= */

function getValidDate(value: Date | null): Date | null {
    if (!value) return null;
    if (Number.isNaN(value.getTime())) return null;

    return value;
}

/**
 * Timeline is a calendar-date visualization, not an instant/time-of-day
 * visualization. Normalize dates to their UTC calendar day before mapping
 * them to the horizontal axis. This prevents an 08:00 schedule timestamp
 * from shifting the bar by one third of a day and keeps date cells aligned
 * with the visible Day/Week/Month grid.
 */
function startOfUtcDay(value: Date): Date {
    return new Date(
        Date.UTC(
            value.getUTCFullYear(),
            value.getUTCMonth(),
            value.getUTCDate()
        )
    );
}

function hexToRgb(
    hex: string
): { r: number; g: number; b: number } | null {
    const normalized = hex.trim().replace(/^#/, "");

    if (
        normalized.length !== 6 ||
        !/^[0-9a-fA-F]{6}$/.test(normalized)
    ) {
        return null;
    }

    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16)
    };
}

function rgbToHsl(
    r: number,
    g: number,
    b: number
): { h: number; s: number; l: number } {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let h = 0;

    if (delta !== 0) {
        if (max === red) {
            h = 60 * (((green - blue) / delta) % 6);
        } else if (max === green) {
            h = 60 * ((blue - red) / delta + 2);
        } else {
            h = 60 * ((red - green) / delta + 4);
        }
    }

    if (h < 0) h += 360;

    const l = (max + min) / 2;
    const s =
        delta === 0
            ? 0
            : delta / (1 - Math.abs(2 * l - 1));

    return {
        h,
        s: s * 100,
        l: l * 100
    };
}

function hslToHex(
    h: number,
    s: number,
    l: number
): string {
    const saturation =
        Math.max(0, Math.min(100, s)) / 100;
    const lightness =
        Math.max(0, Math.min(100, l)) / 100;

    const chroma =
        (1 - Math.abs(2 * lightness - 1)) *
        saturation;

    const hue = ((h % 360) + 360) % 360;
    const x =
        chroma *
        (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness - chroma / 2;

    let red = 0;
    let green = 0;
    let blue = 0;

    if (hue < 60) {
        red = chroma;
        green = x;
    } else if (hue < 120) {
        red = x;
        green = chroma;
    } else if (hue < 180) {
        green = chroma;
        blue = x;
    } else if (hue < 240) {
        green = x;
        blue = chroma;
    } else if (hue < 300) {
        red = x;
        blue = chroma;
    } else {
        red = chroma;
        blue = x;
    }

    const toHex = (value: number): string =>
        Math.round((value + m) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function normalizeWbsColors(
    colors?: Partial<GanttCustomColors> | null
): GanttCustomColors {
    return {
        ...DEFAULT_WBS_COLORS,
        ...(colors ?? {})
    };
}

function deriveExtendedWbsColor(
    level: number,
    baseColor: string
): string {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return baseColor;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const depth = Math.max(1, level - 4);
    const hueShift = (depth * 17) % 43;
    const lightnessDirection =
        depth % 2 === 0 ? -1 : 1;
    const lightnessShift =
        lightnessDirection *
        Math.min(
            16,
            4 + ((depth - 1) % 4) * 3
        );

    const saturationShift =
        (depth - 1) % 3 === 0
            ? 3
            : (depth - 1) % 3 === 1
              ? -4
              : 1;

    return hslToHex(
        hsl.h + hueShift,
        Math.max(
            24,
            Math.min(92, hsl.s + saturationShift)
        ),
        Math.max(
            22,
            Math.min(82, hsl.l + lightnessShift)
        )
    );
}

function buildWbsColorMap(
    colors?: Partial<GanttCustomColors> | null
): Map<number, string> {
    const normalized = normalizeWbsColors(colors);
    const baseColors = [
        normalized.wbsLevel1,
        normalized.wbsLevel2,
        normalized.wbsLevel3,
        normalized.wbsLevel4
    ];

    const map = new Map<number, string>();

    for (let level = 1; level <= 4; level += 1) {
        map.set(level, baseColors[level - 1]);
    }

    for (let level = 5; level <= 50; level += 1) {
        const baseIndex =
            (level - 5) % baseColors.length;

        map.set(
            level,
            deriveExtendedWbsColor(
                level,
                baseColors[baseIndex]
            )
        );
    }

    return map;
}

/* =========================================================
 * HOOK
 * ========================================================= */

export function useGanttTimeline(
    rows: GanttRow[],
    timelineScale: TimelineScale,
    dayWidth: number,
    customColors?: Partial<GanttCustomColors> | null
): UseGanttTimelineResult {
    const safeDayWidth = Math.max(
        1,
        Number.isFinite(dayWidth) ? dayWidth : 28
    );

    const scheduleRange = useMemo(
        () => getProjectScheduleRange(rows),
        [rows]
    );

    const visualRangeStart = useMemo(
        () => startOfUtcDay(scheduleRange.start),
        [scheduleRange.start]
    );

    const visualRangeEnd = useMemo(
        () => startOfUtcDay(scheduleRange.end),
        [scheduleRange.end]
    );

    const timelineUnits = useMemo(
        () =>
            getTimelineUnits(
                scheduleRange,
                timelineScale
            ),
        [scheduleRange, timelineScale]
    );

    const rangeDays = useMemo(() => {
        /*
         * Inclusive calendar-day span:
         *   Sep 07 -> Sep 07 = 1 day
         *   Sep 07 -> Sep 09 = 3 days
         *
         * Keep the extra two days only as timeline breathing room.
         */
        const diff =
            (visualRangeEnd.getTime() -
                visualRangeStart.getTime()) /
            DAY_MS;

        const inclusiveDays =
            Math.floor(diff) + 1;

        return Math.max(
            1,
            inclusiveDays +
                TIMELINE_END_PADDING_DAYS
        );
    }, [visualRangeStart, visualRangeEnd]);

    const timelineWidth = useMemo(() => {
        const width =
            rangeDays * safeDayWidth;

        return Math.max(
            MIN_TIMELINE_WIDTH,
            width
        );
    }, [rangeDays, safeDayWidth]);

    const wbsColorMap = useMemo(
        () => buildWbsColorMap(customColors),
        [customColors]
    );

    const dateToX = useCallback(
        (value: Date | null): number => {
            const date = getValidDate(value);
            if (!date) return 0;

            const calendarDate = startOfUtcDay(date);
            const elapsed =
                (calendarDate.getTime() -
                    visualRangeStart.getTime()) /
                DAY_MS;

            return clamp(
                elapsed * safeDayWidth,
                0,
                timelineWidth
            );
        },
        [
            visualRangeStart,
            safeDayWidth,
            timelineWidth
        ]
    );

    const widthBetweenDates = useCallback(
        (
            start: Date | null,
            end: Date | null
        ): number => {
            const startDate = getValidDate(start);
            const endDate = getValidDate(end);

            if (!startDate || !endDate) return 0;

            const startDay = startOfUtcDay(startDate);
            const endDay = startOfUtcDay(endDate);

            /*
             * Inclusive calendar duration for visual bars.
             * Same-day activity => 1 day; Sep 07 -> Sep 09 => 3 days.
             */
            const elapsed =
                (endDay.getTime() -
                    startDay.getTime()) /
                DAY_MS;

            const days = Math.max(
                1,
                Math.floor(elapsed) + 1
            );

            return Math.max(
                2,
                days * safeDayWidth
            );
        },
        [safeDayWidth]
    );

    const getWbsColor = useCallback(
        (level: number): string => {
            const normalizedLevel = Math.max(
                1,
                Math.round(
                    Number.isFinite(level)
                        ? level
                        : 1
                )
            );

            const directColor =
                wbsColorMap.get(normalizedLevel);

            if (directColor) return directColor;

            const normalized = normalizeWbsColors(
                customColors
            );

            const baseColors = [
                normalized.wbsLevel1,
                normalized.wbsLevel2,
                normalized.wbsLevel3,
                normalized.wbsLevel4
            ];

            const baseIndex =
                (normalizedLevel - 5) %
                baseColors.length;

            return deriveExtendedWbsColor(
                normalizedLevel,
                baseColors[baseIndex]
            );
        },
        [wbsColorMap, customColors]
    );

    return {
        scheduleRange,
        timelineUnits,
        rangeDays,
        timelineWidth,
        dateToX,
        widthBetweenDates,
        getWbsColor
    };
}

export default useGanttTimeline;
