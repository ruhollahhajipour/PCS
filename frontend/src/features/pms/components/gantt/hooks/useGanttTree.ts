import { useCallback, useEffect, useMemo, useState } from "react";
import type { GanttRow } from "../../../api/ganttApi";

export type GanttExpansionLevel = number | "all";

interface UseGanttTreeResult {
    visibleRows: GanttRow[];
    expandedIds: Set<string>;
    allWbsIds: string[];

    expansionLevel: GanttExpansionLevel;
    maxWbsLevel: number;

    toggleRow: (rowId: string) => void;
    expandAll: () => void;
    collapseAll: () => void;
    expandToLevel: (level: number) => void;
}

function collectWbsIds(
    rows: GanttRow[],
    result: string[] = []
): string[] {
    for (const row of rows) {
        if (row.type === "wbs") {
            result.push(row.id);
        }

        if (row.children?.length) {
            collectWbsIds(row.children, result);
        }
    }

    return result;
}

function collectWbsIdsToLevel(
    rows: GanttRow[],
    maxExpandedLevel: number,
    result: string[] = []
): string[] {
    for (const row of rows) {
        if (
            row.type === "wbs" &&
            row.children?.length &&
            row.level < maxExpandedLevel
        ) {
            result.push(row.id);
        }

        if (row.children?.length) {
            collectWbsIdsToLevel(
                row.children,
                maxExpandedLevel,
                result
            );
        }
    }

    return result;
}

function getMaxWbsLevel(
    rows: GanttRow[],
    current = 0
): number {
    let maxLevel = current;

    for (const row of rows) {
        if (row.type === "wbs") {
            maxLevel = Math.max(
                maxLevel,
                row.level
            );
        }

        if (row.children?.length) {
            maxLevel = Math.max(
                maxLevel,
                getMaxWbsLevel(
                    row.children,
                    maxLevel
                )
            );
        }
    }

    return maxLevel;
}

function flattenVisibleRows(
    rows: GanttRow[],
    expandedIds: Set<string>,
    result: GanttRow[] = []
): GanttRow[] {
    for (const row of rows) {
        result.push(row);

        if (
            row.type === "wbs" &&
            row.children?.length &&
            expandedIds.has(row.id)
        ) {
            flattenVisibleRows(
                row.children,
                expandedIds,
                result
            );
        }
    }

    return result;
}

export function useGanttTree(
    rows: GanttRow[]
): UseGanttTreeResult {
    const allWbsIds = useMemo(
        () => collectWbsIds(rows),
        [rows]
    );

    const maxWbsLevel = useMemo(
        () => getMaxWbsLevel(rows),
        [rows]
    );

    const [
        expandedIds,
        setExpandedIds
    ] = useState<Set<string>>(
        () => new Set(allWbsIds)
    );

    const [
        expansionLevel,
        setExpansionLevel
    ] = useState<GanttExpansionLevel>(
        "all"
    );

    useEffect(() => {
        setExpandedIds(previous => {
            const validIds =
                new Set(allWbsIds);

            const next =
                new Set<string>();

            for (const id of previous) {
                if (validIds.has(id)) {
                    next.add(id);
                }
            }

            if (
                next.size === previous.size &&
                [...next].every(id =>
                    previous.has(id)
                )
            ) {
                return previous;
            }

            return next;
        });

        if (allWbsIds.length === 0) {
            setExpansionLevel("all");
        }
    }, [allWbsIds]);

    const toggleRow =
        useCallback(
            (rowId: string) => {
                setExpandedIds(previous => {
                    const next =
                        new Set(previous);

                    if (
                        next.has(rowId)
                    ) {
                        next.delete(rowId);
                    } else {
                        next.add(rowId);
                    }

                    return next;
                });

                setExpansionLevel("all");
            },
            []
        );

    const expandAll =
        useCallback(() => {
            setExpandedIds(
                new Set(allWbsIds)
            );

            setExpansionLevel("all");
        }, [allWbsIds]);

    const collapseAll =
        useCallback(() => {
            setExpandedIds(
                new Set()
            );

            setExpansionLevel(0);
        }, []);

    const expandToLevel =
        useCallback(
            (level: number) => {
                const normalizedLevel =
                    Math.max(
                        0,
                        Math.min(
                            Math.floor(level),
                            maxWbsLevel
                        )
                    );

                const nextExpandedIds =
                    normalizedLevel <= 0
                        ? new Set<string>()
                        : new Set(
                              collectWbsIdsToLevel(
                                  rows,
                                  normalizedLevel
                              )
                          );

                setExpandedIds(
                    nextExpandedIds
                );

                setExpansionLevel(
                    normalizedLevel
                );
            },
            [
                rows,
                maxWbsLevel
            ]
        );

    const visibleRows =
        useMemo(
            () =>
                flattenVisibleRows(
                    rows,
                    expandedIds
                ),
            [
                rows,
                expandedIds
            ]
        );

    return {
        visibleRows,
        expandedIds,
        allWbsIds,

        expansionLevel,
        maxWbsLevel,

        toggleRow,
        expandAll,
        collapseAll,
        expandToLevel
    };
}

export default useGanttTree;