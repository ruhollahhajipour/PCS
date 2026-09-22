"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRelationshipType = normalizeRelationshipType;
exports.normalizeLagUnit = normalizeLagUnit;
exports.applyLag = applyLag;
exports.removeLag = removeLag;
exports.getActivityRelationships = getActivityRelationships;
exports.predecessorRequiredSuccessorStart = predecessorRequiredSuccessorStart;
exports.predecessorRequiredSuccessorFinish = predecessorRequiredSuccessorFinish;
exports.relationshipDescription = relationshipDescription;
exports.relationshipDateContext = relationshipDateContext;
const calendarEngine_1 = require("./calendarEngine");
function normalizeRelationshipType(type) {
    const value = String(type ?? "FS").trim().toUpperCase();
    if (value === "SS" || value === "FF" || value === "SF")
        return value;
    return "FS";
}
function normalizeLagUnit(relationship) {
    return relationship.lagUnit === "hours" ? "hours" : "days";
}
function applyLag(calendar, date, lag = 0, unit = "days") {
    if (!Number.isFinite(lag) || lag === 0)
        return new Date(date.getTime());
    return unit === "hours"
        ? (0, calendarEngine_1.addWorkingHours)(calendar, date, lag)
        : (0, calendarEngine_1.addWorkingDays)(calendar, date, lag);
}
function removeLag(calendar, date, lag = 0, unit = "days") {
    if (!Number.isFinite(lag) || lag === 0)
        return new Date(date.getTime());
    return unit === "hours"
        ? (0, calendarEngine_1.subtractWorkingHours)(calendar, date, lag)
        : (0, calendarEngine_1.subtractWorkingDays)(calendar, date, lag);
}
/**
 * Normalizes the API's predecessor relation into the scheduler graph model.
 * In the current PMS API, GanttRelationship.activityId identifies the
 * predecessor when the relationship is stored inside activity.predecessors.
 */
function getActivityRelationships(activity) {
    return (activity.predecessors ?? []).map((relationship) => ({
        predecessorId: relationship.predecessorId ||
            relationship.successorId ||
            "",
        successorId: relationship.successorId || activity.id,
        type: normalizeRelationshipType(relationship.type),
        lag: Number.isFinite(Number(relationship.lag))
            ? Number(relationship.lag)
            : 0,
        lagUnit: normalizeLagUnit(relationship)
    })).filter(relationship => Boolean(relationship.predecessorId) &&
        Boolean(relationship.successorId));
}
function predecessorRequiredSuccessorStart(relationship, predecessor, calendar) {
    const type = normalizeRelationshipType(relationship.type);
    const lag = Number(relationship.lag ?? 0);
    const unit = normalizeLagUnit(relationship);
    if (type === "FS") {
        if (!predecessor.predecessorFinish)
            return null;
        return applyLag(calendar, predecessor.predecessorFinish, lag, unit);
    }
    if (type === "SS") {
        if (!predecessor.predecessorStart)
            return null;
        return applyLag(calendar, predecessor.predecessorStart, lag, unit);
    }
    return null;
}
function predecessorRequiredSuccessorFinish(relationship, predecessor, calendar) {
    const type = normalizeRelationshipType(relationship.type);
    const lag = Number(relationship.lag ?? 0);
    const unit = normalizeLagUnit(relationship);
    if (type === "FF") {
        if (!predecessor.predecessorFinish)
            return null;
        return applyLag(calendar, predecessor.predecessorFinish, lag, unit);
    }
    if (type === "SF") {
        if (!predecessor.predecessorStart)
            return null;
        return applyLag(calendar, predecessor.predecessorStart, lag, unit);
    }
    return null;
}
function relationshipDescription(relationship) {
    const type = normalizeRelationshipType(relationship.type);
    const lag = Number(relationship.lag ?? 0);
    const unit = normalizeLagUnit(relationship);
    if (!lag)
        return type;
    const sign = lag > 0 ? "+" : "";
    return `${type} ${sign}${lag}${unit === "hours" ? "h" : "d"}`;
}
function relationshipDateContext(predecessor, successor) {
    return {
        predecessorStart: (0, calendarEngine_1.toDate)(predecessor.plannedStart ?? predecessor.start),
        predecessorFinish: (0, calendarEngine_1.toDate)(predecessor.plannedFinish ?? predecessor.finish),
        successorStart: (0, calendarEngine_1.toDate)(successor?.plannedStart ?? successor?.start),
        successorFinish: (0, calendarEngine_1.toDate)(successor?.plannedFinish ?? successor?.finish)
    };
}
