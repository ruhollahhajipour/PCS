import {
    alpha,
    darken,
    lighten
} from "@mui/material/styles";

import type { Theme } from "@mui/material/styles";

import type {
    GanttColorPreset,
    GanttCustomColors,
    GanttColorSettings,
    GanttPalette
} from "./ganttTypes";


// ============================================================
// WBS COLOR SYSTEM
// ============================================================
//
// PCS supports up to 20 WBS hierarchy levels.
//
// Design rule:
//
// Level 1  = strongest / darkest
// Level 20 = lightest
//
// The levels are generated as a controlled tonal spectrum from
// the selected theme color. This keeps the hierarchy visually
// coherent instead of assigning unrelated random colors.
//
// Activity rows intentionally have NO semantic background color.
// Their visual identity comes from the activity bar/status,
// not from the WBS hierarchy fill.
// ============================================================

const WBS_LEVEL_COUNT = 20;

const WBS_LEVEL_KEYS = Array.from(
    { length: WBS_LEVEL_COUNT },
    (_, index) =>
        `wbsLevel${index + 1}` as keyof GanttCustomColors
);


// ============================================================
// Generate WBS Spectrum
// ============================================================

function createWbsSpectrum(
    baseColor: string
): string[] {
    const colors: string[] = [];

    for (let index = 0; index < WBS_LEVEL_COUNT; index += 1) {
        //
        // Level 1:
        // Keep the original theme color as the strongest tone.
        //
        if (index === 0) {
            colors.push(baseColor);
            continue;
        }

        //
        // Progressively lighten deeper WBS levels.
        //
        // The curve is intentionally gradual:
        //
        // L1  0%
        // L2  4%
        // L3  8%
        // ...
        // L20 76%
        //
        // This preserves enough visual separation between adjacent
        // hierarchy levels without producing harsh colors.
        //
        const amount =
            Math.min(
                0.76,
                0.04 * index
            );

        colors.push(
            lighten(
                baseColor,
                amount
            )
        );
    }

    return colors;
}


// ============================================================
// Build Custom WBS Colors
// ============================================================

function buildCustomColors(
    baseWbsColor: string,
    activityColor: string,
    criticalColor: string,
    milestoneColor: string
): GanttCustomColors {
    const spectrum =
        createWbsSpectrum(
            baseWbsColor
        );

    const result =
        {} as GanttCustomColors;

    WBS_LEVEL_KEYS.forEach(
        (key, index) => {
            result[key] =
                spectrum[index];
        }
    );

    //
    // Activity deliberately uses the theme paper color.
    //
    // This means Activity rows remain visually neutral instead
    // of receiving a WBS-level background.
    //
    result.activity =
        activityColor;

    result.critical =
        criticalColor;

    result.milestone =
        milestoneColor;

    return result;
}


// ============================================================
// Default Custom Colors
// ============================================================

export function getDefaultCustomColors(
    theme: Theme
): GanttCustomColors {
    return buildCustomColors(
        theme.palette.primary.main,

        //
        // Activity:
        // neutral / no semantic background.
        //
        theme.palette.background.paper,

        theme.palette.error.main,

        theme.palette.warning.main
    );
}


// ============================================================
// Palette
// ============================================================

export function getPalette(
    theme: Theme,
    preset: GanttColorPreset = "theme"
): GanttPalette {
    const {
        primary,
        secondary,
        error,
        warning,
        text,
        divider
    } = theme.palette;


    // ========================================================
    // Base PCS Theme
    // ========================================================

    const base: GanttPalette = {
        paper:
            theme.palette.background.paper,

        surface:
            theme.palette.background.default,

        background:
            theme.palette.background.default,

        header:
            theme.palette.background.default,

        subHeader:
            alpha(
                theme.palette.background.paper,
                0.72
            ),

        border:
            divider,

        grid:
            alpha(
                divider,
                0.60
            ),

        gridLight:
            alpha(
                divider,
                0.30
            ),

        text:
            text.primary,

        muted:
            text.secondary,

        primary:
            primary.main,

        secondary:
            secondary.main,


        // ====================================================
        // Activity
        // ====================================================
        //
        // Activity rows remain neutral.
        //
        // The activity bar itself can still use these colors.
        //

        activityBackground:
            theme.palette.background.paper,

        activityBorder:
            alpha(
                primary.main,
                0.38
            ),

        activityProgress:
            primary.main,


        // ====================================================
        // Critical
        // ====================================================

        criticalBackground:
            alpha(
                error.main,
                0.10
            ),

        criticalBorder:
            alpha(
                error.main,
                0.40
            ),

        criticalProgress:
            error.main,


        // ====================================================
        // WBS
        // ====================================================

        wbsBackground:
            alpha(
                secondary.main,
                0.075
            ),

        wbsBorder:
            alpha(
                secondary.main,
                0.26
            ),

        wbsProgress:
            secondary.main,


        // ====================================================
        // Milestones / Float
        // ====================================================

        milestone:
            primary.main,

        milestoneCritical:
            error.main,

        float:
            alpha(
                text.secondary,
                0.48
            ),


        // ====================================================
        // Selection / Interaction
        // ====================================================

        selected:
            alpha(
                primary.main,
                0.065
            ),

        selectedBorder:
            alpha(
                primary.main,
                0.26
            ),

        hover:
            alpha(
                primary.main,
                0.035
            ),

        zebra:
            alpha(
                theme.palette.action.hover,
                0.26
            ),


        // ====================================================
        // Semantic
        // ====================================================

        success:
            theme.palette.success.main,

        warning:
            warning.main,

        error:
            error.main
    };


    // ========================================================
    // CORPORATE
    // ========================================================

    switch (preset) {
        case "corporate":
            return {
                ...base,

                //
                // Activity remains neutral.
                //
                activityBackground:
                    theme.palette.background.paper,

                activityBorder:
                    alpha(
                        primary.main,
                        0.42
                    ),

                activityProgress:
                    primary.main,

                wbsBackground:
                    alpha(
                        primary.main,
                        0.065
                    ),

                wbsBorder:
                    alpha(
                        primary.main,
                        0.25
                    ),

                wbsProgress:
                    primary.main,

                milestone:
                    primary.main,

                selected:
                    alpha(
                        primary.main,
                        0.075
                    )
            };


        // ====================================================
        // SLATE
        // ====================================================

        case "slate":
            return {
                ...base,

                activityBackground:
                    theme.palette.background.paper,

                activityBorder:
                    alpha(
                        secondary.main,
                        0.36
                    ),

                activityProgress:
                    secondary.main,

                wbsBackground:
                    alpha(
                        secondary.main,
                        0.075
                    ),

                wbsBorder:
                    alpha(
                        secondary.main,
                        0.25
                    ),

                wbsProgress:
                    secondary.main,

                milestone:
                    secondary.main
            };


        // ====================================================
        // ENGINEERING
        // ====================================================

        case "engineering":
            return {
                ...base,

                activityBackground:
                    theme.palette.background.paper,

                activityBorder:
                    alpha(
                        primary.main,
                        0.32
                    ),

                activityProgress:
                    primary.main,

                wbsBackground:
                    alpha(
                        warning.main,
                        0.085
                    ),

                wbsBorder:
                    alpha(
                        warning.main,
                        0.28
                    ),

                wbsProgress:
                    warning.main,

                milestone:
                    warning.main
            };


        // ====================================================
        // P6
        // ====================================================

        case "p6":
            return {
                ...base,

                activityBackground:
                    theme.palette.background.paper,

                activityBorder:
                    alpha(
                        primary.main,
                        0.34
                    ),

                activityProgress:
                    primary.main,

                wbsBackground:
                    alpha(
                        secondary.main,
                        0.12
                    ),

                wbsBorder:
                    alpha(
                        secondary.main,
                        0.32
                    ),

                wbsProgress:
                    secondary.main,

                milestone:
                    primary.main
            };


        // ====================================================
        // HIGH CONTRAST
        // ====================================================

        case "highContrast":
            return {
                ...base,

                activityBackground:
                    theme.palette.background.paper,

                activityBorder:
                    primary.main,

                activityProgress:
                    primary.main,

                criticalBackground:
                    alpha(
                        error.main,
                        0.18
                    ),

                criticalBorder:
                    error.main,

                wbsBackground:
                    alpha(
                        secondary.main,
                        0.15
                    ),

                wbsBorder:
                    secondary.main,

                wbsProgress:
                    secondary.main,

                milestone:
                    primary.main
            };


        // ====================================================
        // PCS THEME
        // ====================================================

        case "theme":
        default:
            return base;
    }
}


// ============================================================
// Preset-specific WBS Spectrum
// ============================================================
//
// This helper is intentionally exported so Gantt components
// can use the exact same 20-level spectrum as the Custom Color
// editor without duplicating color-generation logic.
// ============================================================

export function getWbsLevelColors(
    theme: Theme,
    preset: GanttColorPreset = "theme"
): string[] {
    let baseColor =
        theme.palette.primary.main;

    switch (preset) {
        case "corporate":
            break;

        case "slate":
            baseColor =
                theme.palette.secondary.main;
            break;

        case "engineering":
            baseColor =
                theme.palette.warning.main;
            break;

        case "p6":
            baseColor =
                theme.palette.secondary.main;
            break;

        case "highContrast":
            baseColor =
                theme.palette.secondary.main;
            break;

        case "theme":
        case "custom":
        default:
            baseColor =
                theme.palette.primary.main;
            break;
    }

    return createWbsSpectrum(
        baseColor
    );
}


// ============================================================
// Preset-aware Custom Color Factory
// ============================================================
//
// Useful when switching themes while preserving the same
// 20-level hierarchy concept.
// ============================================================

export function getPresetCustomColors(
    theme: Theme,
    preset: GanttColorPreset
): GanttCustomColors {
    const levelColors =
        getWbsLevelColors(
            theme,
            preset
        );

    const result =
        {} as GanttCustomColors;

    WBS_LEVEL_KEYS.forEach(
        (key, index) => {
            result[key] =
                levelColors[index];
        }
    );

    //
    // Activity intentionally remains neutral.
    //
    result.activity =
        theme.palette.background.paper;

    result.critical =
        theme.palette.error.main;

    result.milestone =
        theme.palette.warning.main;

    return result;
}


// ============================================================
// Default Color Settings
// ============================================================

export function createDefaultColorSettings(
    theme: Theme
): GanttColorSettings {
    return {
        preset: "theme",

        custom:
            getDefaultCustomColors(
                theme
            )
    };
}


// ============================================================
// Utility
// ============================================================
//
// Kept private intentionally. The palette generation above is
// the public API for the Gantt components.
// ============================================================

void darken;