import {
    Box,
    Chip,
    Popover,
    Typography
} from "@mui/material";

import type {
    GanttPalette,
    PmsColumnDefinition,
    PmsColumnKey
} from "../ganttTypes";

import {
    PMS_COLUMNS
} from "../ganttConstants";

export interface GanttColumnsPopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    colors: GanttPalette;
    visibleColumns: PmsColumnDefinition[];
    visibleColumnKeys: PmsColumnKey[];
    isColumnVisible: (
        key: PmsColumnKey
    ) => boolean;
    toggleColumn: (
        column: PmsColumnDefinition
    ) => void;
    resetColumns: () => void;
}

export default function GanttColumnsPopover({
    open,
    anchorEl,
    onClose,
    colors,
    visibleColumns,
    isColumnVisible,
    toggleColumn,
    resetColumns
}: GanttColumnsPopoverProps) {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
            PaperProps={{
                sx: {
                    width: 290,
                    maxHeight: 480,
                    borderRadius: 1.5,
                    mt: 0.5,
                    boxShadow:
                        "0 12px 36px rgba(15,23,42,.15)"
                }
            }}
        >
            <Box sx={{ p: 1.2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.8
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 800,
                                color: colors.text
                            }}
                        >
                            Columns
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 8.5,
                                color: colors.muted,
                                mt: 0.15
                            }}
                        >
                            Choose fields shown beside
                            the Gantt
                        </Typography>
                    </Box>

                    <Chip
                        label={`${visibleColumns.length}/${PMS_COLUMNS.length}`}
                        size="small"
                        sx={{
                            height: 18,
                            fontSize: 7.5,
                            fontWeight: 800
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        height: 1,
                        mb: 0.4,
                        backgroundColor: colors.border
                    }}
                />

                {PMS_COLUMNS.map(column => (
                    <Box
                        key={column.key}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            minHeight: 27,
                            borderRadius: 0.6,
                            px: 0.3,
                            "&:hover": {
                                backgroundColor:
                                    colors.hover
                            }
                        }}
                    >
                        <Box
                            component="input"
                            type="checkbox"
                            checked={isColumnVisible(
                                column.key
                            )}
                            disabled={Boolean(
                                column.mandatory
                            )}
                            onChange={() =>
                                toggleColumn(column)
                            }
                            sx={{
                                width: 14,
                                height: 14,
                                mr: 0.7,
                                accentColor:
                                    colors.primary,
                                cursor:
                                    column.mandatory
                                        ? "default"
                                        : "pointer"
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.55,
                                minWidth: 0
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 9,
                                    fontWeight:
                                        column.mandatory
                                            ? 800
                                            : 600,
                                    color: colors.text,
                                    whiteSpace:
                                        "nowrap"
                                }}
                            >
                                {column.label}
                            </Typography>

                            {column.mandatory && (
                                <Typography
                                    sx={{
                                        fontSize: 7,
                                        color:
                                            colors.muted
                                    }}
                                >
                                    fixed
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}

                <Box
                    sx={{
                        height: 1,
                        mt: 0.5,
                        mb: 0.45,
                        backgroundColor:
                            colors.border
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}
                >
                    <Box
                        component="button"
                        type="button"
                        onClick={resetColumns}
                        sx={{
                            border: 0,
                            background: "transparent",
                            color: colors.primary,
                            fontFamily: "inherit",
                            fontSize: 8.5,
                            fontWeight: 800,
                            cursor: "pointer",
                            px: 0.8,
                            py: 0.45,
                            borderRadius: 0.5,
                            "&:hover": {
                                backgroundColor:
                                    colors.hover
                            }
                        }}
                    >
                        Reset Columns
                    </Box>
                </Box>
            </Box>
        </Popover>
    );
}