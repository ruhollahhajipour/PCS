import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    useParams
} from "react-router-dom";

import GanttChart from "../components/gantt/GanttChart";

import {
    getProjectGantt,
    replaceActivityPredecessors,
    type GanttActivity,
    type GanttProject,
    type GanttRelationship,
    type GanttRow,
    type HierarchicalGanttProject
} from "../api/ganttApi";

import {
    getPmsWbs,
    type WbsNode
} from "../api/pmsApi";


/* ============================================================
   UTILITIES
   ============================================================ */

function clamp(
    value: number,
    min: number,
    max: number
): number {

    return Math.min(
        Math.max(value, min),
        max
    );
}


/* ============================================================
   FLATTEN WBS TREE
   ============================================================ */

function flattenWbsNodes(
    nodes: WbsNode[]
): WbsNode[] {

    const result: WbsNode[] = [];

    const visit = (
        items: WbsNode[]
    ) => {

        const sorted =
            [...items].sort(
                (a, b) =>
                    (a.sortOrder ?? 0) -
                    (b.sortOrder ?? 0)
            );

        for (const node of sorted) {

            result.push(node);

            if (
                Array.isArray(node.children) &&
                node.children.length > 0
            ) {

                visit(
                    node.children
                );
            }
        }
    };

    visit(nodes);

    return result;
}


/* ============================================================
   FLATTEN ACTIVITIES
   ============================================================ */

function flattenActivities(
    rows: GanttRow[]
): GanttRow[] {

    const result: GanttRow[] = [];

    for (const row of rows) {

        if (
            row.type === "activity"
        ) {

            result.push(row);

            continue;
        }

        if (
            row.children.length > 0
        ) {

            result.push(
                ...flattenActivities(
                    row.children
                )
            );
        }
    }

    return result;
}


/* ============================================================
   BUILD HIERARCHICAL GANTT
   ============================================================ */

function buildHierarchicalRows(
    wbsTree: WbsNode[],
    activities: GanttActivity[]
): GanttRow[] {

    const allWbsNodes =
        flattenWbsNodes(
            wbsTree
        );


    /* ========================================================
       ACTIVITY ROWS
       ======================================================== */

    const activityRows =
        new Map<string, GanttRow>();


    for (const activity of activities) {

        const start =
            Math.max(
                0,
                Number(
                    activity.start
                ) || 0
            );


        const duration =
            Math.max(
                0,
                Number(
                    activity.duration
                ) || 0
            );


        const finish =
            Math.max(
                Number(
                    activity.finish
                ) || 0,
                start + duration
            );


        const activityRow: GanttRow = {

            id:
                activity.id,

            type:
                "activity",

            parentId:
                activity.wbsNodeId ?? null,

            code:
                activity.code,

            name:
                activity.name,

            level:
                Math.max(
                    0,
                    Number(
                        activity.wbsLevel ?? 0
                    )
                ) + 1,


            /* ==================================================
               RELATIVE CPM
               ================================================== */

            start,

            finish,

            duration,


            /* ==================================================
               REAL SCHEDULE DATES
               ================================================== */

            plannedStart:
                activity.plannedStart ?? null,

            plannedFinish:
                activity.plannedFinish ?? null,

            actualStart:
                activity.actualStart ?? null,

            actualFinish:
                activity.actualFinish ?? null,

            remainingDuration:
                Math.max(
                    0,
                    Number(
                        activity.remainingDuration
                    ) || 0
                ),


            /* ==================================================
               SCHEDULE METADATA
               ================================================== */

            description:
                activity.description ?? null,

            constraintType:
                activity.constraintType ?? "ASAP",

            constraintDate:
                activity.constraintDate ?? null,

            status:
                activity.status ?? "NotStarted",


            /* ==================================================
               PROGRESS
               ================================================== */

            progress:
                clamp(
                    Number(
                        activity.progress
                    ) || 0,
                    0,
                    100
                ),


            /* ==================================================
               FLOAT
               ================================================== */

            float:
                Math.max(
                    0,
                    Number(
                        activity.float
                    ) || 0
                ),

            totalFloat:
                Math.max(
                    0,
                    Number(
                        activity.totalFloat
                    ) || 0
                ),

            freeFloat:
                Math.max(
                    0,
                    Number(
                        activity.freeFloat
                    ) || 0
                ),

            drivingFloat:
                Math.max(
                    0,
                    Number(
                        activity.drivingFloat
                    ) || 0
                ),


            /* ==================================================
               STATUS
               ================================================== */

            isCritical:
                Boolean(
                    activity.isCritical
                ),

            isMilestone:
                Boolean(
                    activity.isMilestone
                ),


            /* ==================================================
               RELATIONSHIPS
               ================================================== */

            predecessors:
                activity.predecessors ?? [],

            successors:
                activity.successors ?? [],


            children: []
        };


        activityRows.set(
            activity.id,
            activityRow
        );
    }


    /* ========================================================
       WBS ROWS
       ======================================================== */

    const wbsRows =
        new Map<string, GanttRow>();


    for (const node of allWbsNodes) {

        const row: GanttRow = {

            id:
                node.id,

            type:
                "wbs",

            parentId:
                node.parentId ?? null,

            code:
                node.code,

            name:
                node.name,

            level:
                Math.max(
                    0,
                    Number(
                        node.level
                    ) || 0
                ),


            start: 0,

            finish: 0,

            duration: 0,


            /*
             * PMS WBS progress is authoritative.
             */

            progress:
                clamp(
                    Number(
                        node.progress
                    ) || 0,
                    0,
                    100
                ),


            float: 0,

            totalFloat: 0,

            freeFloat: 0,

            drivingFloat: 0,

            isCritical: false,

            isMilestone: false,

            children: []
        };


        wbsRows.set(
            node.id,
            row
        );
    }


    /* ========================================================
       ATTACH ACTIVITIES TO WBS
       ======================================================== */

    for (
        const activity of activities
    ) {

        const wbsId =
            activity.wbsNodeId;


        if (!wbsId) {
            continue;
        }


        const wbsRow =
            wbsRows.get(
                wbsId
            );


        const activityRow =
            activityRows.get(
                activity.id
            );


        if (
            !wbsRow ||
            !activityRow
        ) {
            continue;
        }


        wbsRow.children.push(
            activityRow
        );
    }


    /* ========================================================
       ATTACH WBS TO PARENTS
       ======================================================== */

    for (
        const node of allWbsNodes
    ) {

        const currentRow =
            wbsRows.get(
                node.id
            );


        if (!currentRow) {
            continue;
        }


        if (node.parentId) {

            const parentRow =
                wbsRows.get(
                    node.parentId
                );


            if (parentRow) {

                parentRow.children.push(
                    currentRow
                );
            }
        }
    }


    /* ========================================================
       SORT TREE
       ======================================================== */

    const sortTree = (
        rows: GanttRow[]
    ): GanttRow[] => {

        rows.sort(
            (a, b) => {

                if (
                    a.type !== b.type
                ) {

                    return a.type === "wbs"
                        ? -1
                        : 1;
                }


                if (
                    a.type === "wbs" &&
                    b.type === "wbs"
                ) {

                    const aNode =
                        allWbsNodes.find(
                            x =>
                                x.id === a.id
                        );


                    const bNode =
                        allWbsNodes.find(
                            x =>
                                x.id === b.id
                        );


                    const sortDifference =
                        (
                            aNode?.sortOrder ?? 0
                        ) -
                        (
                            bNode?.sortOrder ?? 0
                        );


                    if (
                        sortDifference !== 0
                    ) {

                        return sortDifference;
                    }


                    return a.code.localeCompare(
                        b.code,
                        undefined,
                        {
                            numeric: true,
                            sensitivity: "base"
                        }
                    );
                }


                return a.code.localeCompare(
                    b.code,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );
            }
        );


        for (
            const row of rows
        ) {

            if (
                row.children.length > 0
            ) {

                sortTree(
                    row.children
                );
            }
        }


        return rows;
    };


    /* ========================================================
       CALCULATE SUMMARY
       ======================================================== */

    const calculateSummary = (
        row: GanttRow
    ): {
        start: number;
        finish: number;
        critical: boolean;
    } => {

        if (
            row.type === "activity"
        ) {

            return {

                start:
                    row.start,

                finish:
                    row.finish,

                critical:
                    row.isCritical
            };
        }


        if (
            row.children.length === 0
        ) {

            row.start = 0;
            row.finish = 0;
            row.duration = 0;
            row.isCritical = false;

            return {

                start: 0,

                finish: 0,

                critical: false
            };
        }


        const childResults =
            row.children.map(
                child =>
                    calculateSummary(
                        child
                    )
            );


        const validChildren =
            childResults.filter(
                child =>
                    Number.isFinite(
                        child.start
                    ) &&
                    Number.isFinite(
                        child.finish
                    ) &&
                    (
                        child.finish > 0 ||
                        child.start > 0
                    )
            );


        if (
            validChildren.length === 0
        ) {

            row.start = 0;
            row.finish = 0;
            row.duration = 0;

            row.isCritical =
                childResults.some(
                    child =>
                        child.critical
                );

            return {

                start: 0,

                finish: 0,

                critical:
                    row.isCritical
            };
        }


        row.start =
            Math.min(
                ...validChildren.map(
                    child =>
                        child.start
                )
            );


        row.finish =
            Math.max(
                ...validChildren.map(
                    child =>
                        child.finish
                )
            );


        row.duration =
            Math.max(
                0,
                row.finish -
                row.start
            );


        row.isCritical =
            childResults.some(
                child =>
                    child.critical
            );


        return {

            start:
                row.start,

            finish:
                row.finish,

            critical:
                row.isCritical
        };
    };


    /* ========================================================
       ROOT ROWS
       ======================================================== */

    const roots =
        Array.from(
            wbsRows.values()
        ).filter(
            row =>
                !row.parentId
        );


    /* ========================================================
       ORPHAN ACTIVITIES
       ======================================================== */

    const orphanActivities =
        Array.from(
            activityRows.values()
        ).filter(
            activity =>
                !activity.parentId ||
                !wbsRows.has(
                    activity.parentId
                )
        );


    roots.push(
        ...orphanActivities
    );


    /* ========================================================
       FINAL SORT
       ======================================================== */

    const sortedRoots =
        sortTree(
            roots
        );


    for (
        const root of sortedRoots
    ) {

        calculateSummary(
            root
        );
    }


    return sortedRoots;
}


/* ============================================================
   PAGE
   ============================================================ */

export default function ProjectSchedule() {

    const { id } =
        useParams<{
            id: string
        }>();


    const [
        data,
        setData
    ] =
        useState<GanttProject | null>(
            null
        );


    const [
        wbs,
        setWbs
    ] =
        useState<WbsNode[]>([]);


    const [
        error,
        setError
    ] =
        useState<string | null>(
            null
        );


    const [
        loading,
        setLoading
    ] =
        useState(true);


    /* ========================================================
       LOAD DATA
       ======================================================== */

    useEffect(() => {

        let cancelled = false;


        async function load() {

            if (!id) {

                setError(
                    "Project ID not found"
                );

                setLoading(false);

                return;
            }


            setLoading(true);
            setError(null);


            try {

                const [
                    ganttResponse,
                    wbsResponse
                ] =
                    await Promise.all([
                        getProjectGantt(id),
                        getPmsWbs(id)
                    ]);


                if (
                    cancelled
                ) {
                    return;
                }


                if (
                    !ganttResponse ||
                    !Array.isArray(
                        ganttResponse.activities
                    )
                ) {

                    throw new Error(
                        "Invalid schedule data received"
                    );
                }


                setData(
                    ganttResponse
                );


                setWbs(
                    Array.isArray(
                        wbsResponse
                    )
                        ? wbsResponse
                        : []
                );

            }
            catch (err) {

                if (
                    cancelled
                ) {
                    return;
                }


                console.error(
                    "PROJECT SCHEDULE ERROR:",
                    err
                );


                setError(
                    "Failed to load project schedule"
                );

            }
            finally {

                if (
                    !cancelled
                ) {

                    setLoading(false);
                }
            }
        }


        load();


        return () => {

            cancelled = true;
        };

    }, [id]);


    /* ========================================================
       BUILD HIERARCHICAL DATA
       ======================================================== */

    const handleSaveRelationships = async (
        activityId: string,
        predecessors: GanttRelationship[]
    ) => {
        if (!id) {
            throw new Error("Project ID not found.");
        }

        await replaceActivityPredecessors(
            id,
            activityId,
            predecessors.map(item => ({
                predecessorId: item.activityId,
                type: item.type as "FS" | "SS" | "FF" | "SF",
                lag: item.lag
            }))
        );

        try {
            const refreshed = await getProjectGantt(id);
            setData(refreshed);
        } catch (refreshError) {
            console.error(
                "RELATIONSHIP SAVED BUT GANTT REFRESH FAILED:",
                refreshError
            );
        }
    };

    const hierarchicalData =
        useMemo<
            HierarchicalGanttProject | null
        >(() => {

            if (!data) {
                return null;
            }


            const rows =
                buildHierarchicalRows(
                    wbs,
                    data.activities
                );


            const flattenedActivities =
                flattenActivities(
                    rows
                );


            const flattenedWbs =
                flattenWbsNodes(
                    wbs
                );


            const criticalCount =
                flattenedActivities.filter(
                    row =>
                        row.isCritical
                ).length;


            const milestoneCount =
                flattenedActivities.filter(
                    row =>
                        row.isMilestone
                ).length;


            return {

                projectId:
                    data.projectId,

                duration:
                    data.duration,

                rows,

                activityCount:
                    flattenedActivities.length,

                wbsCount:
                    flattenedWbs.length,

                criticalCount,

                milestoneCount
            };

        }, [
            data,
            wbs
        ]);


    /* ========================================================
       LOADING
       ======================================================== */

    if (loading) {

        return (
            <Box
                p={5}
                display="flex"
                alignItems="center"
                gap={2}
            >

                <CircularProgress
                    size={22}
                />

                <Typography
                    color="text.secondary"
                >
                    Loading Project Schedule...
                </Typography>

            </Box>
        );
    }


    /* ========================================================
       ERROR
       ======================================================== */

    if (error) {

        return (
            <Box p={3}>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>
        );
    }


    if (
        !data ||
        !hierarchicalData
    ) {

        return null;
    }


    /* ========================================================
       RENDER
       ======================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0
            }}
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Box
                sx={{
                    mb: 1.5
                }}
            >

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: "#16355B",
                        mb: 0.5
                    }}
                >
                    Project Schedule
                </Typography>


                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Integrated WBS, CPM schedule,
                    critical path and progress view
                </Typography>

            </Box>


            {/* =================================================
                GANTT / PMS
            ================================================= */}

            <Box
                sx={{
                    mt: 0
                }}
            >

                <GanttChart
                    rows={
                        hierarchicalData.rows
                    }
                    projectDuration={
                        hierarchicalData.duration
                    }
                    activityCount={
                        hierarchicalData.activityCount
                    }
                    wbsCount={
                        hierarchicalData.wbsCount
                    }
                    criticalCount={
                        hierarchicalData.criticalCount
                    }
                    milestoneCount={
                        hierarchicalData.milestoneCount
                    }
                    onSaveRelationships={handleSaveRelationships}
                />

            </Box>

        </Box>
    );
}