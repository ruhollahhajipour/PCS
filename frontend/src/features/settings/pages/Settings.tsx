import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";

import {
  PaletteRounded,
  LanguageRounded,
  NotificationsRounded,
  TuneRounded,
  DarkModeRounded,
  ViewCompactRounded,
  CalendarMonthRounded,
  ScheduleRounded,
  RestartAltRounded,
  SaveRounded,
  TodayRounded,
  FlagRounded,
  AccountTreeRounded,
  NumbersRounded,
} from "@mui/icons-material";

import SettingsService from "../services/settings.service";

import type {
  Settings as SettingsModel,
  Language,
  Direction,
  CalendarType,
  DateFormat,
  TimeFormat,
  WeekStart,
  NumberFormat,
  TimelineScale,
} from "../../../types/settings";

const LANGUAGE_OPTIONS: {
  value: Language;
  label: string;
}[] = [
  { value: "en", label: "English" },
  { value: "fa", label: "فارسی" },
  { value: "ar", label: "العربية" },
];

const DATE_FORMAT_OPTIONS: {
  value: DateFormat;
  label: string;
}[] = [
  { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
  { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
  { value: "mm/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "dd-mmm-yyyy", label: "DD-MMM-YYYY" },
  { value: "yyyy/mm/dd", label: "YYYY/MM/DD" },
  {
    value: "persian-yyyy/mm/dd",
    label: "1405/06/12",
  },
  {
    value: "persian-yyyy-mm-dd",
    label: "1405-06-12",
  },
  {
    value: "persian-yy/mm/dd",
    label: "05/06/12",
  },
  {
    value: "persian-yy-mm-dd",
    label: "05-06-12",
  },
  {
    value: "persian-long",
    label: "12 شهریور 1405",
  },
];



function SettingIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: 2.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(37,99,235,.09)",
        color: "#2563EB",
        flexShrink: 0,
        boxShadow:
          "inset 0 0 0 1px rgba(37,99,235,.08)",
      }}
    >
      {children}
    </Box>
  );
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.65,
        minHeight: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        transition: "background-color .18s ease",
        "&:hover": {
          bgcolor: "#F8FAFC",
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 650,
            color: "#334155",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.35,
            fontSize: 10.5,
            color: "#94A3B8",
            lineHeight: 1.35,
          }}
        >
          {description}
        </Typography>
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {control}
      </Box>
    </Box>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <>
      <Box
        sx={{
          px: 2.5,
          py: 2.2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background:
            "linear-gradient(180deg,#FFFFFF,#F8FAFC)",
        }}
      >
        <SettingIcon>{icon}</SettingIcon>

        <Box>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              color: "#1E293B",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 11.5,
              color: "#94A3B8",
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      <Divider />
    </>
  );
}

export default function Settings() {
  const [settings, setSettings] =
    useState<SettingsModel>(
      SettingsService.getDefaults(),
    );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    SettingsService.get().then((value) => {
      if (mounted) {
        setSettings(value);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const update = <K extends keyof SettingsModel>(
    key: K,
    value: SettingsModel[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updatePms = <
    K extends keyof SettingsModel["pms"],
  >(
    key: K,
    value: SettingsModel["pms"][K],
  ) => {
    setSettings((current) => ({
      ...current,
      pms: {
        ...current.pms,
        [key]: value,
      },
    }));
  };

  const saveSettings = async () => {
    await SettingsService.save(settings);
    setSaved(true);
  };

  const resetSettings = async () => {
    await SettingsService.reset();

    const defaults =
      SettingsService.getDefaults();

    setSettings(defaults);
    setSaved(true);
  };

  return (
    <Box
      sx={{
        maxWidth: 1180,
        mx: "auto",
        pb: 5,
      }}
    >
      {/* Header */}

      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.8,
        }}
      >
        <SettingIcon>
          <TuneRounded />
        </SettingIcon>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              color: "#102A43",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            Settings
          </Typography>

          <Typography
            sx={{
              mt: 0.55,
              color: "#64748B",
              fontSize: 13,
            }}
          >
            Personalize your PCS workspace,
            regional preferences and project schedule.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAltRounded />}
            onClick={resetSettings}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 650,
              borderColor: "#CBD5E1",
              color: "#475569",
            }}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveRounded />}
            onClick={saveSettings}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Settings */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 2.5,
        }}
      >
        {/* Appearance */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <SectionHeader
              icon={<PaletteRounded />}
              title="Appearance"
              description={
                "Customize the visual experience of PCS."
              }
            />

            <SettingRow
              title="Theme"
              description="Choose the application appearance."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.theme}
                    onChange={(event) =>
                      update(
                        "theme",
                        event.target.value as SettingsModel["theme"],
                      )
                    }
                  >
                    <MenuItem value="system">
                      System
                    </MenuItem>
                    <MenuItem value="light">
                      Light
                    </MenuItem>
                    <MenuItem value="dark">
                      Dark
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Accent Color"
              description="Select the primary interface color."
              control={
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.8,
                  }}
                >
                  {[
                    "#2563EB",
                    "#0F766E",
                    "#7C3AED",
                    "#475569",
                    "#B45309",
                  ].map((color) => (
                    <Box
                      key={color}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: color,
                        cursor: "pointer",
                        border: "3px solid #FFFFFF",
                        boxShadow:
                          `0 0 0 1px ${color}`,
                        transition: "all .2s ease",
                        "&:hover": {
                          transform: "scale(1.15)",
                        },
                      }}
                    />
                  ))}
                </Box>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Compact Interface"
              description="Use a denser layout for large workspaces."
              control={
                <Switch
                  checked={false}
                  onChange={() => undefined}
                />
              }
            />
          </CardContent>
        </Card>

        {/* Regional */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <SectionHeader
              icon={<LanguageRounded />}
              title="Regional & Calendar"
              description={
                "Language, direction and calendar preferences."
              }
            />

            <SettingRow
              title="Language"
              description="Interface language."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.language}
                    onChange={(event) =>
                      update(
                        "language",
                        event.target.value as Language,
                      )
                    }
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Direction"
              description="Control the interface writing direction."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.direction}
                    onChange={(event) =>
                      update(
                        "direction",
                        event.target.value as Direction,
                      )
                    }
                  >
                    <MenuItem value="auto">
                      Auto
                    </MenuItem>
                    <MenuItem value="ltr">
                      LTR
                    </MenuItem>
                    <MenuItem value="rtl">
                      RTL
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Calendar"
              description="Calendar used for date presentation."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.calendar}
                    onChange={(event) =>
                      update(
                        "calendar",
                        event.target.value as CalendarType,
                      )
                    }
                  >
                    <MenuItem value="gregorian">
                      Gregorian
                    </MenuItem>
                    <MenuItem value="persian">
                      Persian / Jalali
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Date Format"
              description="Regional date presentation."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 155 }}
                >
                  <Select
                    value={settings.dateFormat}
                    onChange={(event) =>
                      update(
                        "dateFormat",
                        event.target.value as DateFormat,
                      )
                    }
                  >
                    {DATE_FORMAT_OPTIONS.map(
                      (option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Time Format"
              description="Choose 12 or 24 hour format."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.timeFormat}
                    onChange={(event) =>
                      update(
                        "timeFormat",
                        event.target.value as TimeFormat,
                      )
                    }
                  >
                    <MenuItem value="24">
                      24-hour
                    </MenuItem>
                    <MenuItem value="12">
                      12-hour
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Week Starts On"
              description="First day used by calendars and schedule views."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.weekStart}
                    onChange={(event) =>
                      update(
                        "weekStart",
                        event.target.value as WeekStart,
                      )
                    }
                  >
                    <MenuItem value="saturday">
                      Saturday
                    </MenuItem>
                    <MenuItem value="sunday">
                      Sunday
                    </MenuItem>
                    <MenuItem value="monday">
                      Monday
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Number Format"
              description="Number and decimal presentation."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.numberFormat}
                    onChange={(event) =>
                      update(
                        "numberFormat",
                        event.target.value as NumberFormat,
                      )
                    }
                  >
                    <MenuItem value="western">
                      1,234.56
                    </MenuItem>
                    <MenuItem value="arabic">
                      ١٬٢٣٤٫٥٦
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />
          </CardContent>
        </Card>

        {/* PMS */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <SectionHeader
              icon={<CalendarMonthRounded />}
              title="PMS / Schedule"
              description={
                "Default Project Schedule and Gantt presentation."
              }
            />

            <SettingRow
              title="Timeline Scale"
              description="Default horizontal timeline granularity."
              control={
                <FormControl
                  size="small"
                  sx={{ minWidth: 135 }}
                >
                  <Select
                    value={settings.pms.timelineScale}
                    onChange={(event) =>
                      updatePms(
                        "timelineScale",
                        event.target.value as TimelineScale,
                      )
                    }
                  >
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">
                      Month
                    </MenuItem>
                    <MenuItem value="quarter">
                      Quarter
                    </MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Select>
                </FormControl>
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Today Line"
              description="Show the current date indicator on the timeline."
              control={
                <Switch
                  checked={settings.pms.showTodayLine}
                  onChange={(event) =>
                    updatePms(
                      "showTodayLine",
                      event.target.checked,
                    )
                  }
                />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Baseline"
              description="Display baseline dates against current schedule."
              control={
                <Switch
                  checked={settings.pms.showBaseline}
                  onChange={(event) =>
                    updatePms(
                      "showBaseline",
                      event.target.checked,
                    )
                  }
                />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Critical Path"
              description="Highlight activities on the critical path."
              control={
                <Switch
                  checked={settings.pms.showCriticalPath}
                  onChange={(event) =>
                    updatePms(
                      "showCriticalPath",
                      event.target.checked,
                    )
                  }
                />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Milestones"
              description="Show milestone activities on the Gantt."
              control={
                <Switch
                  checked={settings.pms.showMilestones}
                  onChange={(event) =>
                    updatePms(
                      "showMilestones",
                      event.target.checked,
                    )
                  }
                />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Total Float"
              description="Display activity float information."
              control={
                <Switch
                  checked={settings.pms.showFloat}
                  onChange={(event) =>
                    updatePms(
                      "showFloat",
                      event.target.checked,
                    )
                  }
                />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Expand WBS by Default"
              description="Open WBS hierarchy when the schedule loads."
              control={
                <Switch
                  checked={settings.pms.defaultWbsExpanded}
                  onChange={(event) =>
                    updatePms(
                      "defaultWbsExpanded",
                      event.target.checked,
                    )
                  }
                />
              }
            />
          </CardContent>
        </Card>

        {/* Notifications */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <SectionHeader
              icon={<NotificationsRounded />}
              title="Notifications"
              description={
                "Manage how PCS communicates system events."
              }
            />

            <SettingRow
              title="Desktop Notifications"
              description="Receive important system notifications."
              control={
                <Switch defaultChecked />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Project Alerts"
              description="Notify about important project events."
              control={
                <Switch defaultChecked />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Email Notifications"
              description="Receive selected notifications by email."
              control={
                <Switch defaultChecked={false} />
              }
            />
          </CardContent>
        </Card>

        {/* Workspace */}

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <SectionHeader
              icon={<TuneRounded />}
              title="Workspace"
              description={
                "Configure the way information is presented."
              }
            />

            <SettingRow
              title="Remember Last Workspace"
              description="Open PCS with your last selected workspace."
              control={
                <Switch defaultChecked />
              }
            />

            <Divider sx={{ mx: 2.5, borderColor: "#F1F5F9" }} />

            <SettingRow
              title="Remember Navigation State"
              description="Keep expanded modules between sessions."
              control={
                <Switch defaultChecked />
              }
            />
          </CardContent>
        </Card>
      </Box>

      {/* Information footer */}

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2.5,
          bgcolor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DarkModeRounded
            sx={{
              fontSize: 20,
              color: "#64748B",
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: 11.5,
                fontWeight: 650,
                color: "#475569",
              }}
            >
              Your preferences are saved locally.
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: 10.5,
                color: "#94A3B8",
              }}
            >
              Calendar and PMS preferences are prepared
              for use across the Project Schedule,
              Gantt and reporting modules.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            color: "#CBD5E1",
          }}
        >
          <TodayRounded sx={{ fontSize: 18 }} />
          <ScheduleRounded sx={{ fontSize: 18 }} />
          <FlagRounded sx={{ fontSize: 18 }} />
          <AccountTreeRounded sx={{ fontSize: 18 }} />
          <NumbersRounded sx={{ fontSize: 18 }} />
          <ViewCompactRounded sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Snackbar
        open={saved}
        autoHideDuration={2200}
        onClose={() => setSaved(false)}
        message="Settings saved successfully"
      />
    </Box>
  );
}