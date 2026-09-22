import {
    Box,
    Typography
} from "@mui/material";

import type {
    GanttPalette
} from "../ganttTypes";

interface PmsKpiProps {
    colors: GanttPalette;

    fontFamily: string;

    effectiveWbsCount: number;
    effectiveActivityCount: number;
    effectiveCriticalCount: number;
    effectiveMilestoneCount: number;

    projectDuration: number;

    statusDate?: Date | null;
    statusDateVisible?: boolean;
}

interface KpiItemProps {
    label: string;
    value: string | number;
    colors: GanttPalette;
    fontFamily: string;
    accent?: string;
}

function KpiItem({
    label,
    value,
    colors,
    fontFamily,
    accent
}: KpiItemProps) {
    return (
        <Box
            sx={{
                minWidth: 92,
                height: 38,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: 1,
                borderRight: `1px solid ${colors.border}`,
                boxSizing: "border-box"
            }}
        >
            <Typography
                sx={{
                    fontFamily,
                    fontSize: 7.5,
                    fontWeight: 550,
                    color: colors.muted,
                    lineHeight: 1,
                    letterSpacing: "0.025em",
                    whiteSpace: "nowrap",
                    textRendering: "optimizeLegibility"
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    mt: 0.45,
                    fontFamily,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: accent ?? colors.text,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                    textRendering: "optimizeLegibility"
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

function formatDuration(
    value: number
): string {
    if (!Number.isFinite(value)) {
        return "—";
    }

    const rounded = Math.max(
        0,
        Math.round(value)
    );

    return `${rounded} d`;
}

function formatStatusDate(
    date?: Date | null
): string {
    if (!date) {
        return "—";
    }

    const year =
        date.getUTCFullYear();

    const month =
        String(
            date.getUTCMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getUTCDate()
        ).padStart(2, "0");

    return `${year}/${month}/${day}`;
}

export default function PmsKpi({
    colors,
    fontFamily,
    effectiveWbsCount,
    effectiveActivityCount,
    effectiveCriticalCount,
    effectiveMilestoneCount,
    projectDuration,
    statusDate,
    statusDateVisible = false
}: PmsKpiProps) {
    return (
        <Box
            sx={{
                width: "100%",
                minHeight: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                backgroundColor: colors.paper,
                borderBottom: `1px solid ${colors.border}`,
                boxSizing: "border-box",
                overflow: "hidden"
            }}
        >
            {/* PMS IDENTIFIER */}
            <Box
                sx={{
                    px: 1.2,
                    minWidth: 130,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    borderRight: `1px solid ${colors.border}`
                }}
            >
                <Typography
                    sx={{
                        fontFamily,
                        fontSize: 7.5,
                        fontWeight: 550,
                        letterSpacing: "0.055em",
                        color: colors.muted,
                        lineHeight: 1,
                        textRendering: "optimizeLegibility"
                    }}
                >
                    PMS
                </Typography>

                <Typography
                    sx={{
                        mt: 0.35,
                        fontFamily,
                        fontSize: 10,
                        fontWeight: 600,
                        color: colors.text,
                        lineHeight: 1.05,
                        letterSpacing: "0.015em",
                        whiteSpace: "nowrap",
                        textRendering: "optimizeLegibility"
                    }}
                >
                    PROJECT SCHEDULE
                </Typography>
            </Box>

            <KpiItem
                label="WBS"
                value={effectiveWbsCount}
                colors={colors}
                fontFamily={fontFamily}
            />

            <KpiItem
                label="ACTIVITIES"
                value={effectiveActivityCount}
                colors={colors}
                fontFamily={fontFamily}
            />

            <KpiItem
                label="CRITICAL"
                value={effectiveCriticalCount}
                colors={colors}
                fontFamily={fontFamily}
                accent={
                    effectiveCriticalCount > 0
                        ? colors.error
                        : undefined
                }
            />

            <KpiItem
                label="MILESTONES"
                value={effectiveMilestoneCount}
                colors={colors}
                fontFamily={fontFamily}
            />

            <KpiItem
                label="PROJECT DURATION"
                value={formatDuration(projectDuration)}
                colors={colors}
                fontFamily={fontFamily}
            />

            {statusDateVisible && (
                <KpiItem
                    label="DATA DATE"
                    value={formatStatusDate(statusDate)}
                    colors={colors}
                    fontFamily={fontFamily}
                    accent={colors.error}
                />
            )}

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0
                }}
            />
        </Box>
    );
}