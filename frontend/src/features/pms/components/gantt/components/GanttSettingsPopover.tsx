import {
    Box,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    Typography
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type {
    GanttPalette,
    ProgressCalculationType,
    TimelineScale
} from "../ganttTypes";
import { SETTINGS_OPTIONS } from "../ganttConstants";
import {
    formatDate
} from "../ganttUtils";

export interface GanttSettingsPopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;

    colors: GanttPalette;

    progressCalculation: ProgressCalculationType;
    setProgressCalculation: (
        value: ProgressCalculationType
    ) => void;

    percentCompleteType: string;
    setPercentCompleteType: (
        value: string
    ) => void;

    activityType: string;
    setActivityType: (
        value: string
    ) => void;

    durationType: string;
    setDurationType: (
        value: string
    ) => void;

    calendar: string;
    setCalendar: (
        value: string
    ) => void;

    activityCode: string;
    setActivityCode: (
        value: string
    ) => void;

    schedulingMode: string;
    setSchedulingMode: (
        value: string
    ) => void;

    constraintType: string;
    setConstraintType: (
        value: string
    ) => void;

    responsible: string;
    setResponsible: (
        value: string
    ) => void;

    primaryResource: string;
    setPrimaryResource: (
        value: string
    ) => void;

    parsedStatusDate: Date | null;
    statusDateVisible: boolean;
    timelineScale: TimelineScale;
}

interface SettingsSelectProps {
    label: string;
    value: string;
    options: Record<string, string>;
    onChange: (value: string) => void;
}

function SettingsSelect({
    label,
    value,
    options,
    onChange
}: SettingsSelectProps) {
    return (
        <FormControl
            size="small"
            fullWidth
        >
            <InputLabel
                sx={{
                    fontSize: 8.5
                }}
            >
                {label}
            </InputLabel>

            <Select
                value={value}
                label={label}
                onChange={event =>
                    onChange(event.target.value)
                }
                sx={{
                    height: 30,
                    fontSize: 8.5,
                    fontWeight: 700,
                    "& .MuiSelect-select": {
                        py: 0.45
                    }
                }}
            >
                {Object.entries(options).map(
                    ([optionValue, optionLabel]) => (
                        <MenuItem
                            key={optionValue}
                            value={optionValue}
                            sx={{
                                fontSize: 9.5
                            }}
                        >
                            {optionLabel}
                        </MenuItem>
                    )
                )}
            </Select>
        </FormControl>
    );
}

export default function GanttSettingsPopover({
    open,
    anchorEl,
    onClose,

    colors,

    progressCalculation,
    setProgressCalculation,

    percentCompleteType,
    setPercentCompleteType,

    activityType,
    setActivityType,

    durationType,
    setDurationType,

    calendar,
    setCalendar,

    activityCode,
    setActivityCode,

    schedulingMode,
    setSchedulingMode,

    constraintType,
    setConstraintType,

    responsible,
    setResponsible,

    primaryResource,
    setPrimaryResource,

    parsedStatusDate,
    statusDateVisible,
    timelineScale
}: GanttSettingsPopoverProps) {
    const sections = [
        {
            title: "PROGRESS CALCULATION",
            fields: [
                {
                    label: "Calculation",
                    value: progressCalculation,
                    options: SETTINGS_OPTIONS.calculation,
                    onChange: (value: string) =>
                        setProgressCalculation(
                            value as ProgressCalculationType
                        )
                },
                {
                    label: "Percent Type",
                    value: percentCompleteType,
                    options: SETTINGS_OPTIONS.percentType,
                    onChange: setPercentCompleteType
                }
            ]
        },
        {
            title: "ACTIVITY DEFAULTS",
            fields: [
                {
                    label: "Activity Type",
                    value: activityType,
                    options: SETTINGS_OPTIONS.activityType,
                    onChange: setActivityType
                },
                {
                    label: "Duration Type",
                    value: durationType,
                    options: SETTINGS_OPTIONS.durationType,
                    onChange: setDurationType
                },
                {
                    label: "Calendar",
                    value: calendar,
                    options: SETTINGS_OPTIONS.calendar,
                    onChange: setCalendar
                },
                {
                    label: "Activity Code",
                    value: activityCode,
                    options: SETTINGS_OPTIONS.activityCode,
                    onChange: setActivityCode
                }
            ]
        },
        {
            title: "SCHEDULING",
            fields: [
                {
                    label: "Scheduling Mode",
                    value: schedulingMode,
                    options: SETTINGS_OPTIONS.schedulingMode,
                    onChange: setSchedulingMode
                },
                {
                    label: "Constraint",
                    value: constraintType,
                    options: SETTINGS_OPTIONS.constraint,
                    onChange: setConstraintType
                },
                {
                    label: "Responsible",
                    value: responsible,
                    options: SETTINGS_OPTIONS.responsible,
                    onChange: setResponsible
                },
                {
                    label: "Primary Resource",
                    value: primaryResource,
                    options: SETTINGS_OPTIONS.primaryResource,
                    onChange: setPrimaryResource
                }
            ]
        }
    ];

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
                    width: 350,
                    maxHeight: 560,
                    borderRadius: 1.5,
                    mt: 0.5,
                    boxShadow:
                        "0 12px 36px rgba(15,23,42,.15)"
                }
            }}
        >
            <Box sx={{ p: 1.35 }}>
                {/* HEADER */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 11.5,
                                fontWeight: 800,
                                color: colors.text
                            }}
                        >
                            PMS Settings
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 8.5,
                                color: colors.muted,
                                mt: 0.15
                            }}
                        >
                            Project controls preferences
                        </Typography>
                    </Box>

                    <Chip
                        label="CPM"
                        size="small"
                        sx={{
                            height: 18,
                            fontSize: 7.5,
                            fontWeight: 800,
                            backgroundColor: alpha(
                                colors.primary,
                                0.08
                            ),
                            color: colors.primary
                        }}
                    />
                </Box>

                {/* SETTINGS SECTIONS */}
                {sections.map(
                    (section, sectionIndex) => (
                        <Box key={section.title}>
                            {sectionIndex > 0 && (
                                <Divider
                                    sx={{
                                        my: 1.05
                                    }}
                                />
                            )}

                            <Typography
                                sx={{
                                    fontSize: 8,
                                    fontWeight: 800,
                                    color: colors.muted,
                                    letterSpacing: ".06em",
                                    mb: 0.55
                                }}
                            >
                                {section.title}
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: 0.7
                                }}
                            >
                                {section.fields.map(
                                    field => (
                                        <SettingsSelect
                                            key={
                                                field.label
                                            }
                                            label={
                                                field.label
                                            }
                                            value={
                                                field.value
                                            }
                                            options={
                                                field.options
                                            }
                                            onChange={
                                                field.onChange
                                            }
                                        />
                                    )
                                )}
                            </Box>
                        </Box>
                    )
                )}

                <Divider sx={{ my: 1.05 }} />

                {/* STATUS / DATA DATE */}
                <Typography
                    sx={{
                        fontSize: 8,
                        fontWeight: 800,
                        color: colors.muted,
                        letterSpacing: ".06em",
                        mb: 0.55
                    }}
                >
                    STATUS / DATA DATE
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
                        gap: 0.7
                    }}
                >
                    {[
                        {
                            title: "Data Date",
                            value: parsedStatusDate
                                ? formatDate(
                                      parsedStatusDate
                                  )
                                : "Not defined",
                            color: statusDateVisible
                                ? colors.error
                                : colors.muted
                        },
                        {
                            title: "Timeline",
                            value:
                                timelineScale
                                    .charAt(0)
                                    .toUpperCase() +
                                timelineScale.slice(1),
                            color: colors.text
                        }
                    ].map(item => (
                        <Box
                            key={item.title}
                            sx={{
                                minHeight: 42,
                                px: 0.8,
                                py: 0.55,
                                border: `1px solid ${colors.border}`,
                                borderRadius: 0.7,
                                backgroundColor:
                                    colors.surface
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 7.2,
                                    color: colors.muted,
                                    mb: 0.2,
                                    textTransform:
                                        "uppercase",
                                    letterSpacing: ".04em"
                                }}
                            >
                                {item.title}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 9,
                                    fontWeight: 800,
                                    color: item.color
                                }}
                            >
                                {item.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={
                                statusDateVisible
                            }
                            disabled
                            sx={{
                                p: 0.45
                            }}
                        />
                    }
                    label={
                        <Typography
                            sx={{
                                fontSize: 8.2,
                                color: colors.muted
                            }}
                        >
                            Show Data Date line when
                            available
                        </Typography>
                    }
                    sx={{
                        mt: 0.35,
                        ml: -0.25,
                        mb: -0.25
                    }}
                />
            </Box>
        </Popover>
    );
}