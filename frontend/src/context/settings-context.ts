import { createContext } from "react";

import type { Settings, PmsViewSettings } from "../types/settings";

type SettingsUpdateChanges = Partial<Settings>;
type PmsSettingsUpdateChanges = Partial<PmsViewSettings>;

export interface SettingsContextValue {
    settings: Settings;
    isLoading: boolean;

    updateSettings: (
        changes: SettingsUpdateChanges,
    ) => Promise<void>;

    updatePmsSettings: (
        changes: PmsSettingsUpdateChanges,
    ) => Promise<void>;

    resetSettings: () => Promise<void>;

    reloadSettings: () => Promise<void>;
}

export const SettingsContext =
    createContext<SettingsContextValue | undefined>(undefined);
