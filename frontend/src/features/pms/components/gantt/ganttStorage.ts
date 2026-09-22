import type { Theme } from "@mui/material/styles";

import {
    COLUMNS_STORAGE_KEY,
    DEFAULT_VISIBLE_PMS_COLUMNS,
    PMS_COLUMNS,
    STORAGE_KEY
} from "./ganttConstants";

import {
    createDefaultColorSettings,
    getDefaultCustomColors
} from "./ganttColors";

import type {
    GanttColorSettings,
    GanttColorPreset,
    PmsColumnKey
} from "./ganttTypes";

export function loadColorSettings(
    theme: Theme
): GanttColorSettings {
    const defaults = createDefaultColorSettings(theme);

    if (typeof window === "undefined") {
        return defaults;
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return defaults;
        }

        const parsed = JSON.parse(raw);

        const preset: GanttColorPreset =
            parsed?.preset ?? "theme";

        return {
            preset,
            custom: {
                ...defaults.custom,
                ...(parsed?.custom ?? {})
            }
        };
    } catch {
        return defaults;
    }
}

export function saveColorSettings(
    settings: GanttColorSettings
): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );
    } catch {
        // LocalStorage may be unavailable in restricted environments.
    }
}

export function loadVisibleColumns(): PmsColumnKey[] {
    if (typeof window === "undefined") {
        return [...DEFAULT_VISIBLE_PMS_COLUMNS];
    }

    try {
        const raw =
            window.localStorage.getItem(
                COLUMNS_STORAGE_KEY
            );

        if (!raw) {
            return [...DEFAULT_VISIBLE_PMS_COLUMNS];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [...DEFAULT_VISIBLE_PMS_COLUMNS];
        }

        const valid = new Set(
            PMS_COLUMNS.map(column => column.key)
        );

        const filtered = parsed.filter(
            (value): value is PmsColumnKey =>
                typeof value === "string" &&
                valid.has(value as PmsColumnKey)
        );

        const mandatory = PMS_COLUMNS
            .filter(column => column.mandatory)
            .map(column => column.key);

        const result = Array.from(
            new Set([
                ...mandatory,
                ...filtered
            ])
        );

        return result.length
            ? result
            : [...DEFAULT_VISIBLE_PMS_COLUMNS];
    } catch {
        return [...DEFAULT_VISIBLE_PMS_COLUMNS];
    }
}

export function saveVisibleColumns(
    columns: PmsColumnKey[]
): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(
            COLUMNS_STORAGE_KEY,
            JSON.stringify(columns)
        );
    } catch {
        // LocalStorage may be unavailable.
    }
}

export function getResetColorSettings(
    theme: Theme
): GanttColorSettings {
    return {
        preset: "theme",
        custom: getDefaultCustomColors(theme)
    };
}