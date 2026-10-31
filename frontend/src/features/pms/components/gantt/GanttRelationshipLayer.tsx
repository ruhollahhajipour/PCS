import { Box } from "@mui/material";
import { useMemo } from "react";

import type { GanttRow } from "../../api/ganttApi";

export type GanttRelationshipLayerProps = {
    rows: GanttRow[];
    timelineWidth: number;
    rowHeight: number;
    dateToX: (date: Date | null) => number;
    selectedActivityId?: string | null;
    visible?: boolean;
    color?: string;
    highlightColor?: string;
    opacity?: number;
    strokeWidth?: number;
};

type RelationshipType = "FS" | "SS" | "FF" | "SF";

type Relationship = {
    activityId: string;
    code?: string;
    type?: RelationshipType;
    lag?: number;
};

type Line = {
    id: string;
    points: string;
    highlighted: boolean;
    label: string;
    labelX: number;
    labelY: number;
};

function parseDate(value: string | number | Date | null | undefined): Date | null {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

function relationshipType(value: unknown): RelationshipType {
    if (value === "SS" || value === "FF" || value === "SF") {
        return value;
    }

    return "FS";
}

function getStart(row: GanttRow): Date | null {
    return parseDate(
        row.start ??
        row.plannedStart ??
        row.actualStart ??
        null
    );
}

function getFinish(row: GanttRow): Date | null {
    return parseDate(
        row.finish ??
        row.plannedFinish ??
        row.actualFinish ??
        null
    );
}

function getRelationshipRows(rows: GanttRow[]): Map<string, GanttRow> {
    const map = new Map<string, GanttRow>();

    for (const row of rows) {
        if (row.type === "activity") {
            map.set(row.id, row);
        }
    }

    return map;
}

function getSourceX(
    type: RelationshipType,
    row: GanttRow,
    dateToX: (date: Date | null) => number
): number {
    return dateToX(
        type === "SS" || type === "SF"
            ? getStart(row)
            : getFinish(row)
    );
}

function getTargetX(
    type: RelationshipType,
    row: GanttRow,
    dateToX: (date: Date | null) => number
): number {
    return dateToX(
        type === "FF" || type === "SF"
            ? getFinish(row)
            : getStart(row)
    );
}

function relationshipLabel(type: RelationshipType, lag: unknown): string {
    const numericLag = Number(lag ?? 0);
    if (!Number.isFinite(numericLag) || numericLag === 0) return type;
    const sign = numericLag > 0 ? "+" : "";
    return `${type} ${sign}${numericLag}d`;
}

function buildPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number
): string {
    if (Math.abs(startY - endY) < 0.5) {
        return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    const direction = endX >= startX ? 1 : -1;
    const exitX = startX + direction * 8;
    const entryX = endX - direction * 8;
    const middleX = (exitX + entryX) / 2;

    return [
        `M ${startX} ${startY}`,
        `L ${exitX} ${startY}`,
        `L ${middleX} ${startY}`,
        `L ${middleX} ${endY}`,
        `L ${entryX} ${endY}`,
        `L ${endX} ${endY}`
    ].join(" ");
}

export default function GanttRelationshipLayer({
    rows,
    timelineWidth,
    rowHeight,
    dateToX,
    selectedActivityId = null,
    visible = true,
    color = "#64748B",
    highlightColor = "#2563EB",
    opacity = 0.62,
    strokeWidth = 1.4
}: GanttRelationshipLayerProps) {
    const activityMap = useMemo(
        () => getRelationshipRows(rows),
        [rows]
    );

    const lines = useMemo<Line[]>(() => {
        const result: Line[] = [];

        for (let successorIndex = 0; successorIndex < rows.length; successorIndex += 1) {
            const successor = rows[successorIndex];

            if (successor.type !== "activity") {
                continue;
            }

            const predecessors = (successor.predecessors ?? []) as Relationship[];

            for (let relationshipIndex = 0; relationshipIndex < predecessors.length; relationshipIndex += 1) {
                const relationship = predecessors[relationshipIndex];
                const predecessor = activityMap.get(relationship.activityId);

                if (!predecessor) {
                    continue;
                }

                const type = relationshipType(relationship.type);
                const sourceDate = type === "SS" || type === "SF"
                    ? getStart(predecessor)
                    : getFinish(predecessor);
                const targetDate = type === "FF" || type === "SF"
                    ? getFinish(successor)
                    : getStart(successor);

                if (!sourceDate || !targetDate) {
                    continue;
                }

                const sourceX = Math.max(
                    0,
                    Math.min(timelineWidth, getSourceX(type, predecessor, dateToX))
                );
                const targetX = Math.max(
                    0,
                    Math.min(timelineWidth, getTargetX(type, successor, dateToX))
                );

                const sourceY = predecessor === successor
                    ? successorIndex * rowHeight + rowHeight / 2
                    : rows.findIndex(row => row.id === predecessor.id) * rowHeight + rowHeight / 2;

                const targetY = successorIndex * rowHeight + rowHeight / 2;

                if (sourceY < 0 || targetY < 0) {
                    continue;
                }

                result.push({
                    id: `${predecessor.id}::${successor.id}::${type}::${relationshipIndex}`,
                    points: buildPath(
                        sourceX,
                        sourceY,
                        targetX,
                        targetY
                    ),
                    highlighted:
                        selectedActivityId !== null &&
                        (
                            predecessor.id === selectedActivityId ||
                            successor.id === selectedActivityId
                        ),
                    label: relationshipLabel(type, relationship.lag),
                    labelX: (sourceX + targetX) / 2,
                    labelY: (sourceY + targetY) / 2 - 4
                });
            }
        }

        return result;
    }, [
        activityMap,
        dateToX,
        rowHeight,
        rows,
        selectedActivityId,
        timelineWidth
    ]);

    if (!visible || lines.length === 0) {
        return null;
    }

    const height = Math.max(1, rows.length * rowHeight);

    return (
        <Box
            aria-hidden="true"
            sx={{
                position: "absolute",
                inset: 0,
                width: timelineWidth,
                height,
                pointerEvents: "none",
                zIndex: 6,
                overflow: "visible"
            }}
        >
            <svg
                width={timelineWidth}
                height={height}
                viewBox={`0 0 ${timelineWidth} ${height}`}
                style={{
                    display: "block",
                    overflow: "visible",
                    pointerEvents: "none"
                }}
            >
                <defs>
                    <marker
                        id="pcs-gantt-relationship-arrow"
                        markerWidth="7"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M 0 0 L 7 3.5 L 0 7 Z"
                            fill={color}
                        />
                    </marker>
                    <marker
                        id="pcs-gantt-relationship-arrow-highlight"
                        markerWidth="7"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path
                            d="M 0 0 L 7 3.5 L 0 7 Z"
                            fill={highlightColor}
                        />
                    </marker>
                </defs>

                {lines.map(line => (
                    <g key={line.id}>
                        <path
                            d={line.points}
                            fill="none"
                            stroke={line.highlighted ? highlightColor : color}
                            strokeWidth={line.highlighted ? Math.max(2.2, strokeWidth) : strokeWidth}
                            strokeOpacity={line.highlighted ? 0.95 : opacity}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            markerEnd={
                                line.highlighted
                                    ? "url(#pcs-gantt-relationship-arrow-highlight)"
                                    : "url(#pcs-gantt-relationship-arrow)"
                            }
                        />
                        <text
                            x={line.labelX}
                            y={line.labelY}
                            textAnchor="middle"
                            fontSize="7.5"
                            fontFamily="Vazirmatn, Segoe UI, sans-serif"
                            fontWeight={line.highlighted ? 800 : 600}
                            fill={line.highlighted ? highlightColor : color}
                            opacity={line.highlighted ? 1 : 0.78}
                            paintOrder="stroke"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeOpacity="0.8"
                        >
                            {line.label}
                        </text>
                    </g>
                ))}
            </svg>
        </Box>
    );
}
