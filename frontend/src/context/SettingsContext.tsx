import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import type { ReactNode } from "react";

import SettingsService from "../features/settings/services/settings.service";

type Settings = ReturnType<
    typeof SettingsService.getDefaults
>;

type SettingsUpdateChanges = Parameters<
    typeof SettingsService.update
>[0];

type PmsSettingsUpdateChanges = Parameters<
    typeof SettingsService.updatePms
>[0];

interface SettingsContextValue {
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

interface SettingsProviderProps {
    children: ReactNode;
}

const SettingsContext =
    createContext<SettingsContextValue | undefined>(
        undefined,
    );

export function SettingsProvider({
    children,
}: SettingsProviderProps) {
    const [settings, setSettings] =
        useState<Settings>(
            SettingsService.getDefaults(),
        );

    const [isLoading, setIsLoading] =
        useState<boolean>(true);

    const loadSettings = useCallback(
        async () => {
            setIsLoading(true);

            try {
                const current =
                    await SettingsService.get();

                setSettings(current);
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    /**
     * Apply global language and text direction.
     *
     * Direction:
     * - auto + English -> LTR
     * - auto + Persian -> RTL
     * - auto + Arabic  -> RTL
     * - explicit value -> use selected direction
     */
    useEffect(() => {
        const resolvedDirection =
            settings.direction === "auto"
                ? settings.language === "en"
                    ? "ltr"
                    : "rtl"
                : settings.direction;

        document.documentElement.dir =
            resolvedDirection;

        document.documentElement.lang =
            settings.language;
    }, [
        settings.direction,
        settings.language,
    ]);

    const updateSettings = useCallback(
        async (
            changes: SettingsUpdateChanges,
        ) => {
            const updated =
                await SettingsService.update(
                    changes,
                );

            setSettings(updated);
        },
        [],
    );

    const updatePmsSettings = useCallback(
        async (
            changes: PmsSettingsUpdateChanges,
        ) => {
            const updated =
                await SettingsService.updatePms(
                    changes,
                );

            setSettings((current) => ({
                ...current,
                pms: updated,
            }));
        },
        [],
    );

    const resetSettings = useCallback(
        async () => {
            await SettingsService.reset();

            const defaults =
                SettingsService.getDefaults();

            setSettings(defaults);
        },
        [],
    );

    const reloadSettings = useCallback(
        async () => {
            await loadSettings();
        },
        [loadSettings],
    );

    const value = useMemo<SettingsContextValue>(
        () => ({
            settings,
            isLoading,
            updateSettings,
            updatePmsSettings,
            resetSettings,
            reloadSettings,
        }),
        [
            settings,
            isLoading,
            updateSettings,
            updatePmsSettings,
            resetSettings,
            reloadSettings,
        ],
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings(): SettingsContextValue {
    const context =
        useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettings must be used inside SettingsProvider.",
        );
    }

    return context;
}

export default SettingsContext;