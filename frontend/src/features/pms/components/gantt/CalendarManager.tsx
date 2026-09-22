import {
    Add,
    DeleteOutline,
    EventAvailable,
    Save,
    Settings
} from "@mui/icons-material";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import type { ScheduleCalendar } from "../../scheduling/scheduleTypes";
import {
    addCalendarException,
    removeCalendarException,
    updateCalendarDefaultIntervals,
    updateCalendarWeekDay,
    upsertCalendar
} from "../../scheduling/calendarRegistry";

interface CalendarManagerProps {
    open: boolean;
    onClose: () => void;
    calendars: ScheduleCalendar[];
    onChange: (calendars: ScheduleCalendar[]) => void;
    projectCalendarId: string;
    onProjectCalendarChange: (calendarId: string) => void;
    colors: {
        paper: string;
        surface: string;
        border: string;
        text: string;
        muted: string;
        primary: string;
        hover: string;
        error: string;
    };
}

const WEEKDAYS: Array<{ index: number; label: string; short: string }> = [
    { index: 6, label: "شنبه", short: "ش" },
    { index: 0, label: "یکشنبه", short: "ی" },
    { index: 1, label: "دوشنبه", short: "د" },
    { index: 2, label: "سه‌شنبه", short: "س" },
    { index: 3, label: "چهارشنبه", short: "چ" },
    { index: 4, label: "پنجشنبه", short: "پ" },
    { index: 5, label: "جمعه", short: "ج" }
];

function formatHour(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function cloneCalendar(calendar: ScheduleCalendar): ScheduleCalendar {
    return {
        ...calendar,
        defaultIntervals: calendar.defaultIntervals.map(interval => ({ ...interval })),
        week: Object.fromEntries(
            Object.entries(calendar.week).map(([day, definition]) => [
                Number(day),
                {
                    ...definition,
                    intervals: definition.intervals?.map(interval => ({ ...interval }))
                }
            ])
        ),
        exceptions: calendar.exceptions?.map(exception => ({
            ...exception,
            intervals: exception.intervals?.map(interval => ({ ...interval }))
        }))
    };
}

export default function CalendarManager({
    open,
    onClose,
    calendars,
    onChange,
    projectCalendarId,
    onProjectCalendarChange,
    colors
}: CalendarManagerProps) {
    const [selectedId, setSelectedId] = useState(projectCalendarId);
    const [draftName, setDraftName] = useState("");
    const [newExceptionDate, setNewExceptionDate] = useState("");

    const selected = useMemo(
        () => calendars.find(calendar => calendar.id === selectedId) ?? calendars[0] ?? null,
        [calendars, selectedId]
    );

    const commit = (next: ScheduleCalendar) => {
        onChange(upsertCalendar(calendars, next));
    };

    const updateSelected = (updater: (calendar: ScheduleCalendar) => ScheduleCalendar) => {
        if (!selected) return;
        commit(updater(cloneCalendar(selected)));
    };

    const handleNew = () => {
        const base = calendars.find(item => item.id === projectCalendarId) ?? calendars[0];
        if (!base) return;
        const id = `custom-${Date.now()}`;
        const next: ScheduleCalendar = {
            ...cloneCalendar(base),
            id,
            name: "Custom Calendar",
            exceptions: []
        };
        onChange([...calendars, next]);
        setSelectedId(id);
    };

    const handleDelete = () => {
        if (!selected || selected.id === "standard-5-day" || selected.id === projectCalendarId) return;
        const next = calendars.filter(calendar => calendar.id !== selected.id);
        onChange(next);
        setSelectedId(next[0]?.id ?? projectCalendarId);
    };

    const saveName = () => {
        if (!selected || !draftName.trim()) return;
        updateSelected(calendar => ({ ...calendar, name: draftName.trim() }));
        setDraftName("");
    };

    const toggleDay = (dayIndex: number, working: boolean) => {
        updateSelected(calendar =>
            updateCalendarWeekDay(
                calendar,
                dayIndex,
                working,
                calendar.week[dayIndex]?.intervals ?? calendar.defaultIntervals
            )
        );
    };

    const setHours = (field: "start" | "end", value: string) => {
        const [hoursText, minutesText = "0"] = value.split(":");
        const hours = Math.max(0, Math.min(24, Number(hoursText) + Number(minutesText) / 60));
        if (!Number.isFinite(hours)) return;
        updateSelected(calendar => {
            const current = calendar.defaultIntervals[0] ?? { startHour: 8, endHour: 16 };
            const next = {
                startHour: field === "start" ? hours : current.startHour,
                endHour: field === "end" ? hours : current.endHour
            };
            return updateCalendarDefaultIntervals(calendar, [next]);
        });
    };

    const addException = () => {
        if (!selected || !newExceptionDate) return;
        commit(addCalendarException(selected, {
            date: newExceptionDate,
            working: false,
            name: "Project Holiday"
        }));
        setNewExceptionDate("");
    };

    const removeException = (date: string) => {
        updateSelected(calendar => removeCalendarException(calendar, date));
    };

    const firstInterval = selected?.defaultIntervals[0] ?? { startHour: 8, endHour: 16 };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 1.5,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.paper,
                    overflow: "hidden"
                }
            }}
        >
            <DialogTitle sx={{ px: 1.6, py: 1, borderBottom: `1px solid ${colors.border}`, backgroundColor: alpha(colors.primary, 0.055) }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <Settings sx={{ fontSize: 18, color: colors.primary }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 900 }}>CALENDAR MANAGER</Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography sx={{ fontSize: 9, color: colors.muted }}>{calendars.length} CALENDARS</Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: "grid", gridTemplateColumns: "210px minmax(0, 1fr)", minHeight: 420 }}>
                <Box sx={{ borderRight: `1px solid ${colors.border}`, backgroundColor: colors.surface, p: 0.8, display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ px: 0.5, pb: 0.5, fontSize: 8.5, fontWeight: 900, color: colors.muted, letterSpacing: 0.35 }}>CALENDARS</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                        {calendars.map(item => (
                            <Box
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                sx={{
                                    minHeight: 32,
                                    px: 0.75,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.6,
                                    borderRadius: 0.8,
                                    cursor: "pointer",
                                    backgroundColor: selectedId === item.id ? alpha(colors.primary, 0.1) : "transparent",
                                    border: `1px solid ${selectedId === item.id ? alpha(colors.primary, 0.28) : "transparent"}`
                                }}
                            >
                                <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: selectedId === item.id ? colors.primary : colors.border }} />
                                <Typography noWrap sx={{ flex: 1, fontSize: 9.5, fontWeight: selectedId === item.id ? 800 : 600 }}>{item.name}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ flex: 1 }} />
                    <Button size="small" variant="outlined" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={handleNew} sx={{ fontSize: 9, minHeight: 28 }}>New Custom</Button>
                </Box>

                {selected ? (
                    <Box sx={{ p: 1.2, overflow: "auto" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mb: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                label="Calendar Name"
                                value={draftName || selected.name}
                                onChange={event => setDraftName(event.target.value)}
                                sx={{ "& .MuiInputBase-input": { fontSize: 10 } }}
                            />
                            <IconButton size="small" onClick={saveName} disabled={!draftName.trim()} sx={{ border: `1px solid ${colors.border}`, borderRadius: 0.8 }}>
                                <Save sx={{ fontSize: 16, color: colors.primary }} />
                            </IconButton>
                            <IconButton size="small" onClick={handleDelete} disabled={selected.id === "standard-5-day" || selected.id === projectCalendarId} sx={{ border: `1px solid ${colors.border}`, borderRadius: 0.8 }}>
                                <DeleteOutline sx={{ fontSize: 16, color: colors.error }} />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.7, mb: 1.2 }}>
                            <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 0.8, p: 0.7 }}>
                                <Typography sx={{ fontSize: 8.5, color: colors.muted, fontWeight: 800 }}>PROJECT CALENDAR</Typography>
                                <FormControlLabel
                                    control={<Checkbox size="small" checked={projectCalendarId === selected.id} onChange={event => { if (event.target.checked) onProjectCalendarChange(selected.id); }} />}
                                    label={<Typography sx={{ fontSize: 9.5, fontWeight: 800 }}>Use as Project Calendar</Typography>}
                                    sx={{ m: 0 }}
                                />
                            </Box>
                            <Box sx={{ border: `1px solid ${colors.border}`, borderRadius: 0.8, p: 0.7 }}>
                                <Typography sx={{ fontSize: 8.5, color: colors.muted, fontWeight: 800 }}>WORKING TIME</Typography>
                                <Typography sx={{ fontSize: 11, fontWeight: 900, color: colors.primary }}>{selected.hoursPerDay.toFixed(1)} h/day</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 0.8 }} />
                        <Typography sx={{ fontSize: 9.5, fontWeight: 900, mb: 0.55 }}>WORKING DAYS</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 0.35, mb: 1.1 }}>
                            {WEEKDAYS.map(day => {
                                const working = selected.week[day.index]?.working ?? false;
                                return (
                                    <Box key={day.index} sx={{ border: `1px solid ${working ? alpha(colors.primary, 0.3) : colors.border}`, borderRadius: 0.7, backgroundColor: working ? alpha(colors.primary, 0.07) : colors.surface, textAlign: "center", py: 0.35 }}>
                                        <Typography sx={{ fontSize: 8, fontWeight: 800 }}>{day.short}</Typography>
                                        <Checkbox size="small" checked={working} onChange={event => toggleDay(day.index, event.target.checked)} sx={{ p: 0.1 }} />
                                        <Typography sx={{ fontSize: 7, color: colors.muted }}>{day.label}</Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        <Typography sx={{ fontSize: 9.5, fontWeight: 900, mb: 0.55 }}>DEFAULT WORKING HOURS</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.7, mb: 1.1 }}>
                            <TextField size="small" type="time" label="Start" value={formatHour(firstInterval.startHour)} onChange={event => setHours("start", event.target.value)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputBase-input": { fontSize: 10 } }} />
                            <TextField size="small" type="time" label="Finish" value={formatHour(firstInterval.endHour)} onChange={event => setHours("end", event.target.value)} InputLabelProps={{ shrink: true }} sx={{ "& .MuiInputBase-input": { fontSize: 10 } }} />
                        </Box>

                        <Divider sx={{ mb: 0.8 }} />
                        <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                            <Typography sx={{ fontSize: 9.5, fontWeight: 900 }}>EXCEPTIONS / HOLIDAYS</Typography>
                            <Box sx={{ flex: 1 }} />
                            <TextField size="small" type="date" value={newExceptionDate} onChange={event => setNewExceptionDate(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 130, mr: 0.4, "& .MuiInputBase-input": { fontSize: 9 } }} />
                            <Button size="small" variant="outlined" startIcon={<EventAvailable sx={{ fontSize: 14 }} />} onClick={addException} disabled={!newExceptionDate} sx={{ minHeight: 28, fontSize: 8.5 }}>Add</Button>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                            {(selected.exceptions ?? []).length === 0 ? (
                                <Typography sx={{ fontSize: 8.5, color: colors.muted, py: 0.5 }}>No calendar exceptions.</Typography>
                            ) : (selected.exceptions ?? []).map(exception => (
                                <Box key={exception.date} sx={{ display: "flex", alignItems: "center", px: 0.6, py: 0.35, border: `1px solid ${colors.border}`, borderRadius: 0.6 }}>
                                    <Typography sx={{ fontSize: 9, fontWeight: 800 }}>{exception.date}</Typography>
                                    <Box sx={{ flex: 1 }} />
                                    <Typography sx={{ fontSize: 8, color: colors.muted }}>{exception.name || (exception.working ? "Working" : "Holiday")}</Typography>
                                    <IconButton size="small" onClick={() => removeException(exception.date)} sx={{ ml: 0.2, p: 0.25 }}><DeleteOutline sx={{ fontSize: 14, color: colors.error }} /></IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ p: 2 }}><Typography>No calendar available.</Typography></Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 1.2, py: 0.8, borderTop: `1px solid ${colors.border}` }}>
                <Typography sx={{ flex: 1, fontSize: 8.5, color: colors.muted }}>Calendar changes are used by the CPM scheduler.</Typography>
                <Button size="small" onClick={onClose} variant="contained" sx={{ fontSize: 9, minHeight: 28 }}>Done</Button>
            </DialogActions>
        </Dialog>
    );
}
