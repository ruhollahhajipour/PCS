import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {
    Add,
    DeleteOutline,
    LinkOutlined
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";

import type { GanttPalette } from "./ganttTypes";
import type { GanttRelationship, GanttRow } from "../../api/ganttApi";

interface RelationshipEditorProps {
    open: boolean;
    onClose: () => void;
    row: GanttRow | null;
    rows: GanttRow[];
    colors: GanttPalette;
    onSave: (rowId: string, predecessors: GanttRelationship[]) => void;
}

type RelationshipType = "FS" | "SS" | "FF" | "SF";

function flattenActivities(rows: GanttRow[], output: GanttRow[] = []): GanttRow[] {
    for (const row of rows) {
        if (row.type === "activity") output.push(row);
        if (row.children?.length) flattenActivities(row.children, output);
    }
    return output;
}

function createsCycle(
    successorId: string,
    predecessorId: string,
    rows: GanttRow[],
    currentPredecessors: GanttRelationship[]
): boolean {
    const graph = new Map<string, string[]>();
    const activities = flattenActivities(rows);

    for (const activity of activities) {
        graph.set(
            activity.id,
            (activity.predecessors ?? []).map(item => item.activityId)
        );
    }

    graph.set(
        successorId,
        currentPredecessors.map(item => item.activityId)
    );

    const visited = new Set<string>();
    const stack = new Set<string>();

    const visit = (id: string): boolean => {
        if (id === predecessorId) return true;
        if (stack.has(id)) return false;
        if (visited.has(id)) return false;

        visited.add(id);
        stack.add(id);

        for (const predecessor of graph.get(id) ?? []) {
            if (visit(predecessor)) return true;
        }

        stack.delete(id);
        return false;
    };

    return visit(successorId);
}

export default function RelationshipEditor({
    open,
    onClose,
    row,
    rows,
    colors,
    onSave
}: RelationshipEditorProps) {
    const activities = useMemo(
        () => flattenActivities(rows),
        [rows]
    );

    const [relationships, setRelationships] = useState<GanttRelationship[]>([]);
    const [newPredecessorId, setNewPredecessorId] = useState("");
    const [newType, setNewType] = useState<RelationshipType>("FS");
    const [newLag, setNewLag] = useState("0");
    const [error, setError] = useState("");

    useEffect(() => {
        setRelationships(row?.predecessors ? row.predecessors.map(item => ({ ...item })) : []);
        setNewPredecessorId("");
        setNewType("FS");
        setNewLag("0");
        setError("");
    }, [row, open]);

    if (!row) return null;

    const availableActivities = activities.filter(item =>
        item.id !== row.id &&
        !relationships.some(relationship => relationship.activityId === item.id)
    );

    const updateRelationship = (
        index: number,
        patch: Partial<GanttRelationship>
    ) => {
        setRelationships(previous => previous.map((item, itemIndex) =>
            itemIndex === index ? { ...item, ...patch } : item
        ));
        setError("");
    };

    const removeRelationship = (index: number) => {
        setRelationships(previous => previous.filter((_, itemIndex) => itemIndex !== index));
        setError("");
    };

    const addRelationship = () => {
        if (!newPredecessorId) {
            setError("Select a predecessor activity.");
            return;
        }

        const lag = Number(newLag);
        if (!Number.isFinite(lag)) {
            setError("Lag must be a valid number.");
            return;
        }

        if (createsCycle(row.id, newPredecessorId, rows, relationships)) {
            setError("This relationship would create a circular dependency.");
            return;
        }

        setRelationships(previous => [
            ...previous,
            {
                activityId: newPredecessorId,
                code: activities.find(item => item.id === newPredecessorId)?.code ?? newPredecessorId,
                type: newType,
                lag
            }
        ]);

        setNewPredecessorId("");
        setNewLag("0");
        setError("");
    };

    const save = () => {
        onSave(row.id, relationships);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 1.25,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.paper,
                    direction: "ltr"
                }
            }}
        >
            <DialogTitle
                sx={{
                    px: 1.6,
                    py: 1,
                    borderBottom: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8
                }}
            >
                <LinkOutlined sx={{ fontSize: 17, color: colors.primary }} />
                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 900, color: colors.text }}>
                        RELATIONSHIPS
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 9, color: colors.muted }}>
                        {row.code} • {row.name}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 1.2 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) 110px 100px 38px",
                        gap: 0.5,
                        alignItems: "center",
                        mb: 0.7
                    }}
                >
                    <Typography sx={{ px: 0.5, fontSize: 8.5, fontWeight: 900, color: colors.muted }}>
                        PREDECESSOR
                    </Typography>
                    <Typography sx={{ px: 0.5, fontSize: 8.5, fontWeight: 900, color: colors.muted }}>
                        TYPE
                    </Typography>
                    <Typography sx={{ px: 0.5, fontSize: 8.5, fontWeight: 900, color: colors.muted }}>
                        LAG / LEAD
                    </Typography>
                    <Box />
                </Box>

                {relationships.map((relationship, index) => {
                    const activity = activities.find(item => item.id === relationship.activityId);
                    return (
                        <Box
                            key={`${relationship.activityId}-${index}`}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 110px 100px 38px",
                                gap: 0.5,
                                alignItems: "center",
                                mb: 0.5
                            }}
                        >
                            <Box sx={{ minWidth: 0, px: 0.7, py: 0.65, border: `1px solid ${colors.border}`, borderRadius: 0.6, backgroundColor: colors.surface }}>
                                <Typography noWrap sx={{ fontSize: 9.5, fontWeight: 800, color: colors.text }}>
                                    {activity?.code ?? relationship.code ?? relationship.activityId}
                                    {activity?.name ? ` • ${activity.name}` : ""}
                                </Typography>
                            </Box>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={relationship.type || "FS"}
                                    onChange={event => updateRelationship(index, { type: event.target.value })}
                                    sx={{ fontSize: 10, height: 34 }}
                                >
                                    <MenuItem value="FS">FS</MenuItem>
                                    <MenuItem value="SS">SS</MenuItem>
                                    <MenuItem value="FF">FF</MenuItem>
                                    <MenuItem value="SF">SF</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                size="small"
                                type="number"
                                value={relationship.lag ?? 0}
                                onChange={event => updateRelationship(index, { lag: Number(event.target.value) })}
                                inputProps={{ step: 0.5 }}
                                sx={{ "& input": { fontSize: 10, py: 0.9 } }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => removeRelationship(index)}
                                sx={{ width: 34, height: 34, color: colors.error }}
                            >
                                <DeleteOutline sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                    );
                })}

                <Box
                    sx={{
                        mt: 1,
                        p: 0.8,
                        border: `1px dashed ${alphaColor(colors.primary, 0.35)}`,
                        borderRadius: 0.75,
                        backgroundColor: alphaColor(colors.primary, 0.035)
                    }}
                >
                    <Typography sx={{ mb: 0.55, fontSize: 9, fontWeight: 900, color: colors.primary }}>
                        ADD RELATIONSHIP
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 110px 100px auto", gap: 0.5 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: 10 }}>Predecessor</InputLabel>
                            <Select
                                value={newPredecessorId}
                                label="Predecessor"
                                onChange={event => setNewPredecessorId(event.target.value)}
                                sx={{ fontSize: 10, height: 34 }}
                            >
                                {availableActivities.map(activity => (
                                    <MenuItem key={activity.id} value={activity.id} sx={{ fontSize: 10 }}>
                                        {activity.code} • {activity.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" fullWidth>
                            <InputLabel sx={{ fontSize: 10 }}>Type</InputLabel>
                            <Select
                                value={newType}
                                label="Type"
                                onChange={event => setNewType(event.target.value as RelationshipType)}
                                sx={{ fontSize: 10, height: 34 }}
                            >
                                <MenuItem value="FS">FS</MenuItem>
                                <MenuItem value="SS">SS</MenuItem>
                                <MenuItem value="FF">FF</MenuItem>
                                <MenuItem value="SF">SF</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            label="Lag"
                            type="number"
                            value={newLag}
                            onChange={event => setNewLag(event.target.value)}
                            inputProps={{ step: 0.5 }}
                            InputLabelProps={{ sx: { fontSize: 10 } }}
                            sx={{ "& input": { fontSize: 10, py: 0.9 } }}
                        />
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Add sx={{ fontSize: 14 }} />}
                            onClick={addRelationship}
                            sx={{ minWidth: 92, fontSize: 9, fontWeight: 800, textTransform: "none" }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Typography sx={{ mt: 0.7, fontSize: 9, fontWeight: 700, color: colors.error }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 1.2, py: 0.8, borderTop: `1px solid ${colors.border}` }}>
                <Button size="small" onClick={onClose} sx={{ fontSize: 9, textTransform: "none" }}>
                    Cancel
                </Button>
                <Button size="small" variant="contained" onClick={save} sx={{ fontSize: 9, textTransform: "none" }}>
                    Apply Relationships
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function alphaColor(color: string, opacity: number): string {
    const normalized = color.trim();
    if (normalized.startsWith("#")) {
        const hex = normalized.slice(1);
        const value = hex.length === 3
            ? hex.split("").map(char => char + char).join("")
            : hex;
        const numeric = Number.parseInt(value, 16);
        if (Number.isFinite(numeric)) {
            const r = (numeric >> 16) & 255;
            const g = (numeric >> 8) & 255;
            const b = numeric & 255;
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
    }
    return `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;
}
