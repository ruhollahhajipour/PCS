import http from "../../../api/http";


export type GanttRowType =
    | "wbs"
    | "activity";


export interface GanttRelationship {
    activityId: string;
    code: string;
    type: string;
    lag: number;
}


export interface GanttActivity {

    // ============================================================
    // Identity
    // ============================================================

    id: string;
    code: string;
    name: string;
    description?: string | null;


    // ============================================================
    // CPM / Relative Timeline Compatibility
    // ============================================================

    start: number;
    finish: number;
    duration: number;


    // ============================================================
    // Planned Schedule
    // ============================================================

    plannedStart?: string | null;
    plannedFinish?: string | null;


    // ============================================================
    // Actual Schedule
    // ============================================================

    actualStart?: string | null;
    actualFinish?: string | null;

    remainingDuration: number;


    // ============================================================
    // Constraints
    // ============================================================

    constraintType?: string | null;
    constraintDate?: string | null;


    // ============================================================
    // Progress / Weight
    // ============================================================

    progress: number;
    weight: number;


    // ============================================================
    // Cost / EVM
    // ============================================================

    budget: number;
    actualCost: number;
    earnedValue: number;


    // ============================================================
    // CPM
    // ============================================================

    earlyStart: number;
    earlyFinish: number;

    lateStart: number;
    lateFinish: number;

    totalFloat: number;
    freeFloat: number;
    drivingFloat: number;

    float: number;

    isCritical: boolean;


    // ============================================================
    // Status
    // ============================================================

    status: string;
    isMilestone: boolean;


    // ============================================================
    // WBS Context
    // ============================================================

    wbsNodeId?: string | null;
    wbsCode?: string | null;
    wbsName?: string | null;
    wbsLevel?: number;


    // ============================================================
    // Relationships
    // ============================================================

    predecessors: GanttRelationship[];
    successors: GanttRelationship[];
}


export interface GanttProject {

    projectId: string;

    duration: number;

    activities: GanttActivity[];
}


export interface GanttRow {

    id: string;

    type: GanttRowType;

    parentId?: string | null;

    code: string;

    name: string;

    level: number;


    // ============================================================
    // Relative CPM Timeline
    // ============================================================

    start: number;

    finish: number;

    duration: number;


    // ============================================================
    // Real Schedule Dates
    // ============================================================

    plannedStart?: string | null;

    plannedFinish?: string | null;

    actualStart?: string | null;

    actualFinish?: string | null;

    remainingDuration?: number;


    // ============================================================
    // Schedule Metadata
    // ============================================================

    constraintType?: string | null;

    constraintDate?: string | null;

    status?: string;

    description?: string | null;


    // ============================================================
    // Progress
    // ============================================================

    progress: number;

    float: number;

    totalFloat?: number;

    freeFloat?: number;

    drivingFloat?: number;


    // ============================================================
    // WBS / Critical
    // ============================================================

    isCritical: boolean;

    isMilestone: boolean;


    // ============================================================
    // Relationships
    // ============================================================

    predecessors?: GanttRelationship[];

    successors?: GanttRelationship[];


    // ============================================================
    // Hierarchy
    // ============================================================

    children: GanttRow[];
}


export interface HierarchicalGanttProject {

    projectId: string;

    duration: number;

    rows: GanttRow[];

    activityCount: number;

    wbsCount: number;

    criticalCount: number;

    milestoneCount: number;
}


export async function getProjectGantt(
    projectId: string
): Promise<GanttProject> {

    const response =
        await http.get(
            `/pms/gantt/${projectId}`
        );

    return response.data;
}