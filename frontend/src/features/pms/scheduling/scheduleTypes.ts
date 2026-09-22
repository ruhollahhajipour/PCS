export type ScheduleMode = "CPM" | "Manual";

export type RelationshipType = "FS" | "SS" | "FF" | "SF";

export type ConstraintType =
    | "None"
    | "StartOn"
    | "StartOnOrAfter"
    | "StartOnOrBefore"
    | "FinishOn"
    | "FinishOnOrAfter"
    | "FinishOnOrBefore"
    | "MandatoryStart"
    | "MandatoryFinish"
    | "AsLateAsPossible";

export type ActivityType =
    | "TaskDependent"
    | "ResourceDependent"
    | "LevelOfEffort"
    | "StartMilestone"
    | "FinishMilestone"
    | "WbsSummary";

export type DurationUnit = "days" | "hours";

export interface CalendarInterval {
    startHour: number;
    endHour: number;
}

export interface CalendarDayDefinition {
    working: boolean;
    intervals?: CalendarInterval[];
}

export interface CalendarException {
    date: string;
    working?: boolean;
    intervals?: CalendarInterval[];
    name?: string;
}

export interface ScheduleCalendar {
    id: string;
    name: string;
    hoursPerDay: number;
    defaultIntervals: CalendarInterval[];
    week: Record<number, CalendarDayDefinition>;
    exceptions?: CalendarException[];
}

export interface ScheduleRelationship {
    predecessorId: string;
    successorId: string;
    type: RelationshipType;
    lag?: number;
    lagUnit?: DurationUnit;
}

export interface ScheduleActivity {
    id: string;
    code?: string;
    name?: string;

    /**
     * Scheduled/current dates.
     * These are the dates produced by the scheduling engine.
     */
    start?: string | null;
    finish?: string | null;

    /**
     * Baseline/planned dates.
     * These are intentionally kept separate from current schedule dates.
     */
    plannedStart?: string | null;
    plannedFinish?: string | null;

    /**
     * Activity duration in working days.
     */
    duration?: number | null;

    /**
     * Remaining duration in working days.
     */
    remainingDuration?: number | null;

    actualStart?: string | null;
    actualFinish?: string | null;

    constraintType?: ConstraintType | string | null;
    constraintDate?: string | null;

    isMilestone?: boolean;
    activityType?: ActivityType;

    calendarId?: string | null;

    predecessors?: ScheduleRelationship[];
    successors?: ScheduleRelationship[];
}

export interface ScheduleOptions {
    projectStart?: Date | string | null;
    projectFinish?: Date | string | null;
    dataDate?: Date | string | null;

    defaultCalendarId?: string;

    scheduleMode?: ScheduleMode;

    criticalFloatThreshold?: number;

    maxIterations?: number;

    /**
     * If true, a valid start/finish pair can be used to derive duration
     * when an explicit duration is not available.
     */
    deriveDurationFromDates?: boolean;

    /**
     * Default duration for an activity when no usable duration or date pair
     * exists.
     */
    defaultDuration?: number;
}

export interface ScheduledActivity {
    id: string;

    earlyStart: Date | null;
    earlyFinish: Date | null;

    lateStart: Date | null;
    lateFinish: Date | null;

    /**
     * Calculated working duration in calendar days.
     */
    duration: number;

    /**
     * Calculated working duration in hours.
     */
    durationHours: number;

    totalFloat: number;
    freeFloat: number;
    drivingFloat: number;

    isCritical: boolean;
}

export interface ScheduleResult {
    activities: Record<string, ScheduledActivity>;

    projectStart: Date | null;
    projectFinish: Date | null;

    /**
     * Project duration in working days.
     */
    projectDuration: number;

    /**
     * Project duration in working hours.
     */
    projectDurationHours: number;

    criticalPath: string[];

    warnings: string[];
}