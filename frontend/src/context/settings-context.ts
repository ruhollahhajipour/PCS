import { createContext } from "react";

import SettingsService from "../features/settings/services/settings.service";

type Settings = ReturnType<typeof SettingsService.getDefaults>;
type SettingsUpdateChanges = Parameters<typeof SettingsService.update>[0];
type PmsSettingsUpdateChanges = Parameters<typeof SettingsService.updatePms>[0];

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
