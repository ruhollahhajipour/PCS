import {
    useCallback,
    useMemo,
    useState
} from "react";

import {
    COLUMNS_STORAGE_KEY,
    MAX_COLUMN_WIDTH,
    MIN_COLUMN_WIDTH,
    PMS_COLUMNS,
    DEFAULT_VISIBLE_PMS_COLUMNS
} from "../ganttConstants";

import type {
    PmsColumnDefinition,
    PmsColumnKey,
    PmsColumnStyle
} from "../ganttTypes";

/* =========================================================
 * TYPES
 * ========================================================= */

export type ColumnAlignment =
    | "left"
    | "center"
    | "right";

interface StoredColumnSettings {
    visibleColumns?: PmsColumnKey[];

    columnWidths?: Partial<
        Record<PmsColumnKey, number>
    >;

    columnAlignments?: Partial<
        Record<PmsColumnKey, ColumnAlignment>
    >;

    columnStyles?: Partial<
        Record<PmsColumnKey, PmsColumnStyle>
    >;
}

export interface UseGanttColumnsResult {
    anchor: HTMLElement | null;

    open: boolean;

    setAnchor: (
        anchor: HTMLElement | null
    ) => void;

    close: () => void;

    visibleColumns: PmsColumnDefinition[];

    visibleColumnKeys: PmsColumnKey[];

    columnWidths: Record<
        PmsColumnKey,
        number
    >;

    columnAlignments: Record<
        PmsColumnKey,
        ColumnAlignment
    >;

    columnStyles: Record<
        PmsColumnKey,
        PmsColumnStyle
    >;

    selectedColumnKey: PmsColumnKey | null;

    setSelectedColumn: (
        key: PmsColumnKey
    ) => void;

    labelWidth: number;

    gridSettingsOpen: boolean;

    toggleGrid: () => void;

    isVisible: (
        key: PmsColumnKey
    ) => boolean;

    toggle: (
        key: PmsColumnKey
    ) => void;

    reset: () => void;

    resize: (
        key: PmsColumnKey,
        delta: number
    ) => void;

    setWidth: (
        key: PmsColumnKey,
        width: number
    ) => void;

    setAlignment: (
        key: PmsColumnKey,
        alignment: ColumnAlignment
    ) => void;

    setColumnStyle: (
        key: PmsColumnKey,
        patch: Partial<PmsColumnStyle>
    ) => void;

    resetColumnStyle: (
        key: PmsColumnKey
    ) => void;

    resetWidths: () => void;
}

/* =========================================================
 * DEFAULTS
 * ========================================================= */

const DEFAULT_COLUMN_WIDTHS: Record<
    PmsColumnKey,
    number
> = PMS_COLUMNS.reduce(
    (result, column) => {
        result[column.key] = column.width;

        return result;
    },
    {} as Record<
        PmsColumnKey,
        number
    >
);

const DEFAULT_COLUMN_ALIGNMENTS:
    Record<
        PmsColumnKey,
        ColumnAlignment
    > = PMS_COLUMNS.reduce(
        (result, column) => {
            result[column.key] =
                column.align ?? "left";

            return result;
        },
        {} as Record<
            PmsColumnKey,
            ColumnAlignment
        >
    );

const DEFAULT_FONT_FAMILY =
    "Vazirmatn";

const DEFAULT_FONT_SIZE = 10;

const DEFAULT_FONT_WEIGHT = 500;

const DEFAULT_FONT_COLOR =
    "#263238";

const DEFAULT_FONT_ITALIC = false;

const DEFAULT_VERTICAL_ALIGNMENT:
    PmsColumnStyle["verticalAlignment"] =
        "center";

/* =========================================================
 * DEFAULT COLUMN STYLES
 * ========================================================= */

const DEFAULT_COLUMN_STYLES:
    Record<
        PmsColumnKey,
        PmsColumnStyle
    > = PMS_COLUMNS.reduce(
        (result, column) => {
            result[column.key] = {
                fontFamily:
                    DEFAULT_FONT_FAMILY,

                fontSize:
                    DEFAULT_FONT_SIZE,

                fontWeight:
                    DEFAULT_FONT_WEIGHT,

                fontItalic:
                    DEFAULT_FONT_ITALIC,

                fontColor:
                    DEFAULT_FONT_COLOR,

                verticalAlignment:
                    DEFAULT_VERTICAL_ALIGNMENT
            };

            return result;
        },
        {} as Record<
            PmsColumnKey,
            PmsColumnStyle
        >
    );

/* =========================================================
 * STORAGE
 * ========================================================= */

function readStoredSettings():
    StoredColumnSettings {
    if (
        typeof window ===
        "undefined"
    ) {
        return {};
    }

    try {
        const raw =
            window.localStorage.getItem(
                COLUMNS_STORAGE_KEY
            );

        if (!raw) {
            return {};
        }

        const parsed =
            JSON.parse(
                raw
            ) as StoredColumnSettings;

        return parsed ?? {};
    } catch {
        return {};
    }
}

function saveStoredSettings(
    settings: StoredColumnSettings
): void {
    if (
        typeof window ===
        "undefined"
    ) {
        return;
    }

    try {
        window.localStorage.setItem(
            COLUMNS_STORAGE_KEY,
            JSON.stringify(settings)
        );
    } catch {
        /*
         * localStorage may be unavailable
         * in restricted/private environments.
         */
    }
}

/* =========================================================
 * SANITIZATION
 * ========================================================= */

function sanitizeVisibleColumns(
    value:
        | PmsColumnKey[]
        | undefined
): PmsColumnKey[] {
    if (!Array.isArray(value)) {
        return [
            ...DEFAULT_VISIBLE_PMS_COLUMNS
        ];
    }

    const available =
        new Set<PmsColumnKey>(
            PMS_COLUMNS.map(
                column =>
                    column.key
            )
        );

    const mandatory =
        PMS_COLUMNS
            .filter(
                column =>
                    column.mandatory
            )
            .map(
                column =>
                    column.key
            );

    const sanitized =
        value.filter(
            key =>
                available.has(key)
        );

    for (
        const key of mandatory
    ) {
        if (
            !sanitized.includes(
                key
            )
        ) {
            sanitized.unshift(key);
        }
    }

    return [
        ...new Set(
            sanitized
        )
    ];
}

function sanitizeWidths(
    value:
        | Partial<
              Record<
                  PmsColumnKey,
                  number
              >
          >
        | undefined
): Record<
    PmsColumnKey,
    number
> {
    const result = {
        ...DEFAULT_COLUMN_WIDTHS
    };

    if (!value) {
        return result;
    }

    for (
        const column of PMS_COLUMNS
    ) {
        const width =
            value[column.key];

        if (
            typeof width ===
                "number" &&
            Number.isFinite(width)
        ) {
            result[column.key] =
                Math.round(
                    Math.min(
                        MAX_COLUMN_WIDTH,
                        Math.max(
                            MIN_COLUMN_WIDTH,
                            width
                        )
                    )
                );
        }
    }

    return result;
}

function sanitizeAlignments(
    value:
        | Partial<
              Record<
                  PmsColumnKey,
                  ColumnAlignment
              >
          >
        | undefined
): Record<
    PmsColumnKey,
    ColumnAlignment
> {
    const result = {
        ...DEFAULT_COLUMN_ALIGNMENTS
    };

    if (!value) {
        return result;
    }

    for (
        const column of PMS_COLUMNS
    ) {
        const alignment =
            value[column.key];

        if (
            alignment === "left" ||
            alignment === "center" ||
            alignment === "right"
        ) {
            result[column.key] =
                alignment;
        }
    }

    return result;
}

function sanitizeColumnStyles(
    value:
        | Partial<
              Record<
                  PmsColumnKey,
                  PmsColumnStyle
              >
          >
        | undefined
): Record<
    PmsColumnKey,
    PmsColumnStyle
> {
    const result = {
        ...DEFAULT_COLUMN_STYLES
    };

    if (!value) {
        return result;
    }

    for (
        const column of PMS_COLUMNS
    ) {
        const stored =
            value[column.key];

        if (!stored) {
            continue;
        }

        const fontSize =
            Number(stored.fontSize);

        const fontWeight =
            Number(stored.fontWeight);

        const verticalAlignment =
            stored.verticalAlignment;

        result[column.key] = {
            fontFamily:
                typeof stored.fontFamily ===
                    "string" &&
                stored.fontFamily.trim()
                    ? stored.fontFamily
                    : DEFAULT_FONT_FAMILY,

            fontSize:
                Number.isFinite(fontSize)
                    ? Math.min(
                          18,
                          Math.max(
                              8,
                              fontSize
                          )
                      )
                    : DEFAULT_FONT_SIZE,

            fontWeight:
                Number.isFinite(
                    fontWeight
                )
                    ? Math.min(
                          800,
                          Math.max(
                              400,
                              fontWeight
                          )
                      )
                    : DEFAULT_FONT_WEIGHT,

            fontItalic:
                Boolean(
                    stored.fontItalic
                ),

            fontColor:
                typeof stored.fontColor ===
                    "string" &&
                stored.fontColor.trim()
                    ? stored.fontColor
                    : DEFAULT_FONT_COLOR,

            verticalAlignment:
                verticalAlignment ===
                    "top" ||
                verticalAlignment ===
                    "bottom"
                    ? verticalAlignment
                    : "center"
        };
    }

    return result;
}

/* =========================================================
 * HOOK
 * ========================================================= */

export function useGanttColumns():
    UseGanttColumnsResult {
    const [
        anchor,
        setAnchor
    ] =
        useState<HTMLElement | null>(
            null
        );

    const storedSettings =
        useMemo(
            () =>
                readStoredSettings(),
            []
        );

    const initialVisibleColumns =
        useMemo(
            () =>
                sanitizeVisibleColumns(
                    storedSettings.visibleColumns
                ),
            [
                storedSettings.visibleColumns
            ]
        );

    const [
        visibleColumnKeys,
        setVisibleColumnKeys
    ] =
        useState<PmsColumnKey[]>(
            () =>
                initialVisibleColumns
        );

    const [
        columnWidths,
        setColumnWidths
    ] =
        useState<
            Record<
                PmsColumnKey,
                number
            >
        >(
            () =>
                sanitizeWidths(
                    storedSettings.columnWidths
                )
        );

    const [
        columnAlignments,
        setColumnAlignments
    ] =
        useState<
            Record<
                PmsColumnKey,
                ColumnAlignment
            >
        >(
            () =>
                sanitizeAlignments(
                    storedSettings.columnAlignments
                )
        );

    const [
        columnStyles,
        setColumnStyles
    ] =
        useState<
            Record<
                PmsColumnKey,
                PmsColumnStyle
            >
        >(
            () =>
                sanitizeColumnStyles(
                    storedSettings.columnStyles
                )
        );

    const [
        selectedColumnKey,
        setSelectedColumnKey
    ] =
        useState<PmsColumnKey | null>(
            () =>
                initialVisibleColumns[0] ??
                null
        );

    const [
        gridSettingsOpen,
        setGridSettingsOpen
    ] =
        useState(false);

    /* -----------------------------------------------------
     * POPOVER
     * ----------------------------------------------------- */

    const open =
        Boolean(anchor);

    const close =
        useCallback(() => {
            setAnchor(null);
        }, []);

    /* -----------------------------------------------------
     * VISIBLE COLUMNS
     * ----------------------------------------------------- */

    const visibleColumns =
        useMemo(
            () =>
                PMS_COLUMNS.filter(
                    column =>
                        visibleColumnKeys.includes(
                            column.key
                        )
                ),
            [
                visibleColumnKeys
            ]
        );

    const isVisible =
        useCallback(
            (
                key: PmsColumnKey
            ) =>
                visibleColumnKeys.includes(
                    key
                ),
            [
                visibleColumnKeys
            ]
        );

    /* -----------------------------------------------------
     * SELECT COLUMN
     * ----------------------------------------------------- */

    const setSelectedColumn =
        useCallback(
            (
                key: PmsColumnKey
            ) => {
                if (
                    !visibleColumnKeys.includes(
                        key
                    )
                ) {
                    return;
                }

                setSelectedColumnKey(
                    key
                );
            },
            [
                visibleColumnKeys
            ]
        );

    /* -----------------------------------------------------
     * TOGGLE COLUMN
     * ----------------------------------------------------- */

    const toggle =
        useCallback(
            (
                key: PmsColumnKey
            ) => {
                const column =
                    PMS_COLUMNS.find(
                        item =>
                            item.key ===
                            key
                    );

                if (
                    column?.mandatory
                ) {
                    return;
                }

                setVisibleColumnKeys(
                    previous => {
                        const next =
                            previous.includes(
                                key
                            )
                                ? previous.filter(
                                      item =>
                                          item !==
                                          key
                                  )
                                : [
                                      ...previous,
                                      key
                                  ];

                        /*
                         * Keep the currently selected
                         * column when it remains visible.
                         *
                         * If it was hidden, select the
                         * first remaining visible column.
                         *
                         * IMPORTANT:
                         * Do not use `selectedColumnKey ?? ""`
                         * here because "" is not a valid
                         * PmsColumnKey.
                         */
                        const activeColumnKey =
                            selectedColumnKey;

                        const nextSelected =
                            activeColumnKey !==
                                null &&
                            next.includes(
                                activeColumnKey
                            )
                                ? activeColumnKey
                                : next[0] ??
                                  null;

                        setSelectedColumnKey(
                            nextSelected
                        );

                        saveStoredSettings({
                            visibleColumns:
                                next,
                            columnWidths,
                            columnAlignments,
                            columnStyles
                        });

                        return next;
                    }
                );
            },
            [
                columnWidths,
                columnAlignments,
                columnStyles,
                selectedColumnKey
            ]
        );

    /* -----------------------------------------------------
     * WIDTH
     * ----------------------------------------------------- */

    const setWidth =
        useCallback(
            (
                key: PmsColumnKey,
                width: number
            ) => {
                const nextWidth =
                    Math.round(
                        Math.min(
                            MAX_COLUMN_WIDTH,
                            Math.max(
                                MIN_COLUMN_WIDTH,
                                width
                            )
                        )
                    );

                setColumnWidths(
                    previous => {
                        const next = {
                            ...previous,
                            [key]:
                                nextWidth
                        };

                        saveStoredSettings({
                            visibleColumns:
                                visibleColumnKeys,

                            columnWidths:
                                next,

                            columnAlignments,

                            columnStyles
                        });

                        return next;
                    }
                );
            },
            [
                visibleColumnKeys,
                columnAlignments,
                columnStyles
            ]
        );

    const resize =
        useCallback(
            (
                key: PmsColumnKey,
                delta: number
            ) => {
                setColumnWidths(
                    previous => {
                        const current =
                            previous[key] ??
                            DEFAULT_COLUMN_WIDTHS[
                                key
                            ];

                        const nextWidth =
                            Math.round(
                                Math.min(
                                    MAX_COLUMN_WIDTH,
                                    Math.max(
                                        MIN_COLUMN_WIDTH,
                                        current +
                                            delta
                                    )
                                )
                            );

                        const next = {
                            ...previous,
                            [key]:
                                nextWidth
                        };

                        saveStoredSettings({
                            visibleColumns:
                                visibleColumnKeys,

                            columnWidths:
                                next,

                            columnAlignments,

                            columnStyles
                        });

                        return next;
                    }
                );
            },
            [
                visibleColumnKeys,
                columnAlignments,
                columnStyles
            ]
        );

    /* -----------------------------------------------------
     * HORIZONTAL ALIGNMENT
     * ----------------------------------------------------- */

    const setAlignment =
        useCallback(
            (
                key: PmsColumnKey,
                alignment:
                    ColumnAlignment
            ) => {
                setColumnAlignments(
                    previous => {
                        const next = {
                            ...previous,
                            [key]:
                                alignment
                        };

                        saveStoredSettings({
                            visibleColumns:
                                visibleColumnKeys,

                            columnWidths,

                            columnAlignments:
                                next,

                            columnStyles
                        });

                        return next;
                    }
                );
            },
            [
                visibleColumnKeys,
                columnWidths,
                columnStyles
            ]
        );

    /* -----------------------------------------------------
     * COLUMN STYLE
     * ----------------------------------------------------- */

    const setColumnStyle =
        useCallback(
            (
                key: PmsColumnKey,
                patch:
                    Partial<PmsColumnStyle>
            ) => {
                setColumnStyles(
                    previous => {
                        const current =
                            previous[key] ??
                            DEFAULT_COLUMN_STYLES[
                                key
                            ];

                        const nextStyle: PmsColumnStyle =
                            {
                                ...current,
                                ...patch
                            };

                        const next = {
                            ...previous,
                            [key]:
                                nextStyle
                        };

                        saveStoredSettings({
                            visibleColumns:
                                visibleColumnKeys,

                            columnWidths,

                            columnAlignments,

                            columnStyles:
                                next
                        });

                        return next;
                    }
                );
            },
            [
                visibleColumnKeys,
                columnWidths,
                columnAlignments
            ]
        );

    const resetColumnStyle =
        useCallback(
            (
                key: PmsColumnKey
            ) => {
                setColumnStyles(
                    previous => {
                        const next = {
                            ...previous,
                            [key]: {
                                ...DEFAULT_COLUMN_STYLES[
                                    key
                                ]
                            }
                        };

                        saveStoredSettings({
                            visibleColumns:
                                visibleColumnKeys,

                            columnWidths,

                            columnAlignments,

                            columnStyles:
                                next
                        });

                        return next;
                    }
                );
            },
            [
                visibleColumnKeys,
                columnWidths,
                columnAlignments
            ]
        );

    /* -----------------------------------------------------
     * RESET WIDTHS
     * ----------------------------------------------------- */

    const resetWidths =
        useCallback(() => {
            const widths = {
                ...DEFAULT_COLUMN_WIDTHS
            };

            setColumnWidths(
                widths
            );

            saveStoredSettings({
                visibleColumns:
                    visibleColumnKeys,

                columnWidths:
                    widths,

                columnAlignments,

                columnStyles
            });
        }, [
            visibleColumnKeys,
            columnAlignments,
            columnStyles
        ]);

    /* -----------------------------------------------------
     * RESET ALL
     * ----------------------------------------------------- */

    const reset =
        useCallback(() => {
            const widths = {
                ...DEFAULT_COLUMN_WIDTHS
            };

            const alignments = {
                ...DEFAULT_COLUMN_ALIGNMENTS
            };

            const styles = {
                ...DEFAULT_COLUMN_STYLES
            };

            const columns = [
                ...DEFAULT_VISIBLE_PMS_COLUMNS
            ];

            setVisibleColumnKeys(
                columns
            );

            setColumnWidths(
                widths
            );

            setColumnAlignments(
                alignments
            );

            setColumnStyles(
                styles
            );

            setSelectedColumnKey(
                columns[0] ?? null
            );

            saveStoredSettings({
                visibleColumns:
                    columns,

                columnWidths:
                    widths,

                columnAlignments:
                    alignments,

                columnStyles:
                    styles
            });
        }, []);

    /* -----------------------------------------------------
     * GRID SETTINGS
     * ----------------------------------------------------- */

    const toggleGrid =
        useCallback(() => {
            setGridSettingsOpen(
                previous =>
                    !previous
            );
        }, []);

    /* -----------------------------------------------------
     * LABEL WIDTH
     * ----------------------------------------------------- */

    const labelWidth =
        useMemo(
            () =>
                visibleColumns.reduce(
                    (
                        total,
                        column
                    ) =>
                        total +
                        (
                            columnWidths[
                                column.key
                            ] ??
                            column.width
                        ),
                    0
                ),
            [
                visibleColumns,
                columnWidths
            ]
        );

    return {
        anchor,
        open,

        setAnchor,
        close,

        visibleColumns,
        visibleColumnKeys,

        columnWidths,
        columnAlignments,
        columnStyles,

        selectedColumnKey,

        setSelectedColumn,

        labelWidth,

        gridSettingsOpen,

        toggleGrid,

        isVisible,
        toggle,

        reset,

        resize,
        setWidth,

        setAlignment,

        setColumnStyle,
        resetColumnStyle,

        resetWidths
    };
}

export default useGanttColumns;