import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  AssessmentRounded,
  CalendarMonthRounded,
  CloseRounded,
  DescriptionRounded,
  FileDownloadRounded,
  PictureAsPdfRounded,
  PrintRounded,
  RefreshRounded,
  SettingsRounded,
  SpeedRounded,
  TrendingUpRounded,
} from "@mui/icons-material";

import KPICard from "../../../components/Common/KPI/KPICard";

import DashboardBudgetChart from "./DashboardBudgetChart";
import DashboardCostChart from "./DashboardCostChart";
import DashboardCashFlowChart from "./DashboardCashFlowChart";

import DashboardSPIChart from "./DashboardSPIChart";
import DashboardCPIChart from "./DashboardCPIChart";
import DashboardProjectStatus from "./DashboardProjectStatus";
import DashboardProcurementChart from "./DashboardProcurementChart";
import DashboardWarehouseChart from "./DashboardWarehouseChart";

type ReportOptions = {
  executiveSummary: boolean;
  budgetPerformance: boolean;
  costPerformance: boolean;
  cashFlow: boolean;
  schedulePerformance: boolean;
  projectStatus: boolean;
  procurement: boolean;
  warehouse: boolean;
};

const DEFAULT_REPORT_OPTIONS: ReportOptions = {
  executiveSummary: true,
  budgetPerformance: true,
  costPerformance: true,
  cashFlow: true,
  schedulePerformance: true,
  projectStatus: true,
  procurement: true,
  warehouse: true,
};

export default function Dashboard() {
  const [reportDialogOpen, setReportDialogOpen] =
    useState(false);

  const [reportOptions, setReportOptions] =
    useState<ReportOptions>(
      DEFAULT_REPORT_OPTIONS
    );

  const selectedReportCount = useMemo(() => {
    return Object.values(reportOptions).filter(Boolean)
      .length;
  }, [reportOptions]);

  const updateReportOption = (
    key: keyof ReportOptions
  ) => {
    setReportOptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const selectAllReports = () => {
    setReportOptions(
      Object.keys(DEFAULT_REPORT_OPTIONS).reduce(
        (result, key) => ({
          ...result,
          [key]: true,
        }),
        {} as ReportOptions
      )
    );
  };

  const clearReports = () => {
    setReportOptions(
      Object.keys(DEFAULT_REPORT_OPTIONS).reduce(
        (result, key) => ({
          ...result,
          [key]: false,
        }),
        {} as ReportOptions
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePdfExport = () => {
    /*
     * PDF export will be connected to the central
     * reporting service in the next step.
     *
     * For now the browser print engine provides
     * the correct A4 landscape workflow.
     */
    window.print();
  };

  const handleExcelExport = () => {
    /*
     * Excel export will be connected to the
     * professional XLSX report generator.
     */
    console.info(
      "Excel export requested",
      reportOptions
    );
  };

  return (
    <>
      <Box
        className="pcs-dashboard"
        sx={{
          width: "100%",
          maxWidth: 1800,
          mx: "auto",
          minWidth: 0,
        }}
      >
        {/* =====================================================
            DASHBOARD HEADER
        ===================================================== */}

        <Box
          className="pcs-dashboard-header"
          sx={{
            mb: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },

            display: "flex",

            alignItems: {
              xs: "flex-start",
              lg: "center",
            },

            justifyContent: "space-between",

            gap: {
              xs: 1.5,
              md: 2,
            },

            flexWrap: "wrap",
          }}
        >
          {/* TITLE */}

          <Box
            sx={{
              minWidth: 0,
              flex: "1 1 320px",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 27,
                  md: 30,
                },

                lineHeight: 1.15,

                fontWeight: 800,

                letterSpacing: "-0.025em",

                color: "#0F172A",

                wordBreak: "break-word",
              }}
            >
              Executive Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 0.65,

                fontSize: {
                  xs: 11.5,
                  sm: 13,
                },

                color: "#64748B",

                fontWeight: 500,

                lineHeight: 1.45,
              }}
            >
              South Adish Gas Condensate Refinery
            </Typography>
          </Box>

          {/* HEADER ACTIONS */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={0.8}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },

              alignItems: {
                xs: "stretch",
                sm: "center",
              },

              flexWrap: {
                sm: "wrap",
              },
            }}
          >
            <Chip
              icon={
                <CalendarMonthRounded
                  sx={{
                    fontSize: 16,
                  }}
                />
              }
              label="Reporting Period: Aug 2026"
              size="small"
              variant="outlined"
              sx={{
                height: 32,
                borderRadius: 2,

                borderColor: "#E2E8F0",

                color: "#475569",

                bgcolor: "#FFFFFF",

                fontSize: 11,

                fontWeight: 650,

                "& .MuiChip-icon": {
                  color: "#64748B",
                },
              }}
            />

            <Chip
              icon={
                <RefreshRounded
                  sx={{
                    fontSize: 16,
                  }}
                />
              }
              label="Live Project View"
              size="small"
              sx={{
                height: 32,
                borderRadius: 2,

                bgcolor: "#EFF6FF",

                color: "#2563EB",

                fontSize: 11,

                fontWeight: 700,

                "& .MuiChip-icon": {
                  color: "#2563EB",
                },
              }}
            />

            <Button
              variant="outlined"
              startIcon={
                <SettingsRounded
                  sx={{
                    fontSize: 17,
                  }}
                />
              }
              onClick={() =>
                setReportDialogOpen(true)
              }
              sx={{
                minHeight: 32,

                px: 1.5,

                borderRadius: 2,

                borderColor: "#CBD5E1",

                color: "#334155",

                bgcolor: "#FFFFFF",

                fontSize: 11,

                fontWeight: 700,

                textTransform: "none",

                whiteSpace: "nowrap",

                "&:hover": {
                  borderColor: "#94A3B8",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              Report Settings
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <PictureAsPdfRounded
                  sx={{
                    fontSize: 17,
                  }}
                />
              }
              onClick={handlePdfExport}
              sx={{
                minHeight: 32,

                px: 1.5,

                borderRadius: 2,

                borderColor: "#FECACA",

                color: "#B91C1C",

                bgcolor: "#FFFFFF",

                fontSize: 11,

                fontWeight: 700,

                textTransform: "none",

                whiteSpace: "nowrap",

                "&:hover": {
                  borderColor: "#FCA5A5",
                  bgcolor: "#FEF2F2",
                },
              }}
            >
              PDF
            </Button>

            <Button
              variant="outlined"
              startIcon={
                <FileDownloadRounded
                  sx={{
                    fontSize: 17,
                  }}
                />
              }
              onClick={handleExcelExport}
              sx={{
                minHeight: 32,

                px: 1.5,

                borderRadius: 2,

                borderColor: "#BBF7D0",

                color: "#15803D",

                bgcolor: "#FFFFFF",

                fontSize: 11,

                fontWeight: 700,

                textTransform: "none",

                whiteSpace: "nowrap",

                "&:hover": {
                  borderColor: "#86EFAC",
                  bgcolor: "#F0FDF4",
                },
              }}
            >
              Excel
            </Button>

            <IconButton
              aria-label="Print dashboard"
              onClick={handlePrint}
              sx={{
                width: 32,
                height: 32,

                borderRadius: 2,

                border:
                  "1px solid #E2E8F0",

                bgcolor: "#FFFFFF",

                color: "#475569",

                "&:hover": {
                  bgcolor: "#F8FAFC",
                  borderColor: "#CBD5E1",
                },
              }}
            >
              <PrintRounded
                sx={{
                  fontSize: 17,
                }}
              />
            </IconButton>
          </Stack>
        </Box>

        {/* =====================================================
            EXECUTIVE KPI ROW
        ===================================================== */}

        {reportOptions.executiveSummary && (
          <Grid
            container
            spacing={{
              xs: 1.5,
              sm: 2,
            }}
            sx={{
              mb: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <KPICard
                title="Total Budget"
                value="$1.25 B"
                change="+8.0%"
                subtitle="vs previous period"
                color="#2563EB"
                icon={
                  <AccountBalanceWalletRounded
                    sx={{
                      fontSize: 25,
                    }}
                  />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <KPICard
                title="Actual Cost"
                value="$768 M"
                change="+5.4%"
                subtitle="vs previous period"
                color="#0F766E"
                icon={
                  <TrendingUpRounded
                    sx={{
                      fontSize: 25,
                    }}
                  />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <KPICard
                title="Schedule Performance"
                value="74%"
                change="+3.2%"
                subtitle="overall completion"
                color="#7C3AED"
                icon={
                  <AssessmentRounded
                    sx={{
                      fontSize: 25,
                    }}
                  />
                }
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <KPICard
                title="Cost Performance"
                value="1.04"
                change="+4.8%"
                subtitle="CPI index"
                color="#D97706"
                icon={
                  <SpeedRounded
                    sx={{
                      fontSize: 25,
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        )}

        {/* =====================================================
            MAIN PERFORMANCE
        ===================================================== */}

        {(reportOptions.budgetPerformance ||
          reportOptions.projectStatus) && (
          <Grid
            container
            spacing={{
              xs: 1.5,
              md: 2,
            }}
            sx={{
              mb: {
                xs: 2,
                md: 2.5,
              },
            }}
          >
            {reportOptions.budgetPerformance && (
              <Grid
                size={{
                  xs: 12,
                  lg: reportOptions.projectStatus
                    ? 8
                    : 12,
                }}
              >
                <DashboardBudgetChart />
              </Grid>
            )}

            {reportOptions.projectStatus && (
              <Grid
                size={{
                  xs: 12,
                  lg: reportOptions.budgetPerformance
                    ? 4
                    : 12,
                }}
              >
                <DashboardProjectStatus />
              </Grid>
            )}
          </Grid>
        )}

        {/* =====================================================
            FINANCIAL PERFORMANCE
        ===================================================== */}

        {(reportOptions.costPerformance ||
          reportOptions.cashFlow ||
          reportOptions.schedulePerformance) && (
          <>
            <Box
              sx={{
                mb: 1.5,

                display: "flex",

                alignItems: "center",

                gap: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 13,
                    sm: 14,
                  },

                  fontWeight: 800,

                  color: "#1E293B",

                  whiteSpace: "nowrap",
                }}
              >
                Financial & EVM Performance
              </Typography>

              <Divider
                sx={{
                  flex: 1,
                  borderColor: "#E2E8F0",
                }}
              />
            </Box>

            <Grid
              container
              spacing={{
                xs: 1.5,
                md: 2,
              }}
              sx={{
                mb: {
                  xs: 2,
                  md: 2.5,
                },
              }}
            >
              {reportOptions.costPerformance && (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <DashboardCostChart />
                </Grid>
              )}

              {reportOptions.cashFlow && (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <DashboardCashFlowChart />
                </Grid>
              )}

              {reportOptions.schedulePerformance && (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <DashboardSPIChart />
                </Grid>
              )}

              {reportOptions.costPerformance && (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <DashboardCPIChart />
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* =====================================================
            OPERATIONAL PERFORMANCE
        ===================================================== */}

        {(reportOptions.procurement ||
          reportOptions.warehouse) && (
          <>
            <Box
              sx={{
                mb: 1.5,

                display: "flex",

                alignItems: "center",

                gap: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 13,
                    sm: 14,
                  },

                  fontWeight: 800,

                  color: "#1E293B",

                  whiteSpace: "nowrap",
                }}
              >
                Operational Overview
              </Typography>

              <Divider
                sx={{
                  flex: 1,
                  borderColor: "#E2E8F0",
                }}
              />
            </Box>

            <Grid
              container
              spacing={{
                xs: 1.5,
                md: 2,
              }}
            >
              {reportOptions.procurement && (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <DashboardProcurementChart />
                </Grid>
              )}

              {reportOptions.warehouse && (
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <DashboardWarehouseChart />
                </Grid>
              )}
            </Grid>
          </>
        )}

        {/* =====================================================
            REPORT FOOTER
        ===================================================== */}

        <Box
          className="pcs-dashboard-print-footer"
          sx={{
            display: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: 9,
              color: "#64748B",
            }}
          >
            PCS • Project Control Suite
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#64748B",
            }}
          >
            Executive Project Control Report
          </Typography>

          <Typography
            sx={{
              fontSize: 9,
              color: "#64748B",
            }}
          >
            Reporting Period: Aug 2026
          </Typography>
        </Box>

        {/* =====================================================
            PRINT STYLES
        ===================================================== */}

        <Box
          component="style"
          sx={{
            display: "none",
          }}
        >
          {`
            @media print {

              @page {
                size: A4 landscape;
                margin: 10mm;
              }

              html,
              body {
                width: 100%;
                height: auto;
                background: #ffffff !important;
              }

              body {
                overflow: visible !important;
              }

              .pcs-dashboard {
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }

              .pcs-dashboard-header {
                margin-bottom: 14px !important;
              }

              .pcs-dashboard-header button,
              .pcs-dashboard-header .MuiIconButton-root {
                display: none !important;
              }

              .pcs-dashboard-header .MuiChip-root {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }

              .pcs-dashboard .MuiPaper-root {
                box-shadow: none !important;
                break-inside: avoid;
                page-break-inside: avoid;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }

              .pcs-dashboard .recharts-wrapper {
                overflow: visible !important;
              }

              .pcs-dashboard-print-footer {
                display: flex !important;

                align-items: center;

                justify-content: space-between;

                gap: 12px;

                margin-top: 14px;

                padding-top: 8px;

                border-top:
                  1px solid #E2E8F0;
              }

              .pcs-dashboard
              .MuiGrid-container {
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }

            @media print and (max-width: 900px) {

              @page {
                size: A4 portrait;
                margin: 8mm;
              }
            }
          `}
        </Box>
      </Box>

      {/* =====================================================
          REPORT SETTINGS DIALOG
      ===================================================== */}

      <Dialog
        open={reportDialogOpen}
        onClose={() =>
          setReportDialogOpen(false)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,

            border:
              "1px solid #E2E8F0",

            boxShadow:
              "0 24px 70px rgba(15,23,42,.16)",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2.5,

            pb: 1.5,

            display: "flex",

            alignItems: "flex-start",

            justifyContent: "space-between",

            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 17,

                fontWeight: 800,

                color: "#0F172A",
              }}
            >
              Report Configuration
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: 11,

                color: "#64748B",

                lineHeight: 1.5,
              }}
            >
              Select the sections that should be
              included in the generated report.
            </Typography>
          </Box>

          <IconButton
            onClick={() =>
              setReportDialogOpen(false)
            }
            size="small"
            sx={{
              color: "#64748B",
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 2.5,

            pb: 1.5,
          }}
        >
          {/* QUICK ACTIONS */}

          <Box
            sx={{
              mb: 2,

              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 1,

              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={
                <DescriptionRounded
                  sx={{
                    fontSize: 16,
                  }}
                />
              }
              label={`${selectedReportCount} sections selected`}
              size="small"
              sx={{
                bgcolor: "#EFF6FF",

                color: "#2563EB",

                fontSize: 10.5,

                fontWeight: 700,
              }}
            />

            <Box
              sx={{
                display: "flex",

                gap: 0.5,
              }}
            >
              <Button
                size="small"
                onClick={selectAllReports}
                sx={{
                  fontSize: 10.5,

                  fontWeight: 700,

                  textTransform: "none",
                }}
              >
                Select all
              </Button>

              <Button
                size="small"
                onClick={clearReports}
                sx={{
                  fontSize: 10.5,

                  fontWeight: 700,

                  color: "#64748B",

                  textTransform: "none",
                }}
              >
                Clear
              </Button>
            </Box>
          </Box>

          <Divider
            sx={{
              mb: 1.5,
              borderColor: "#E2E8F0",
            }}
          />

          {/* REPORT OPTIONS */}

          <Grid
            container
            spacing={0.5}
          >
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.executiveSummary
                    }
                    onChange={() =>
                      updateReportOption(
                        "executiveSummary"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,

                      fontWeight: 650,

                      color: "#334155",
                    }}
                  >
                    Executive Summary & KPI
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.budgetPerformance
                    }
                    onChange={() =>
                      updateReportOption(
                        "budgetPerformance"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Budget Performance
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.costPerformance
                    }
                    onChange={() =>
                      updateReportOption(
                        "costPerformance"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Cost / EVM Performance
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.cashFlow
                    }
                    onChange={() =>
                      updateReportOption(
                        "cashFlow"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Cash Flow
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.schedulePerformance
                    }
                    onChange={() =>
                      updateReportOption(
                        "schedulePerformance"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Schedule / SPI
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.projectStatus
                    }
                    onChange={() =>
                      updateReportOption(
                        "projectStatus"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Project Status
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.procurement
                    }
                    onChange={() =>
                      updateReportOption(
                        "procurement"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Procurement Pipeline
                  </Typography>
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      reportOptions.warehouse
                    }
                    onChange={() =>
                      updateReportOption(
                        "warehouse"
                      )
                    }
                    size="small"
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#334155",
                    }}
                  >
                    Warehouse Status
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,

            py: 2,

            borderTop:
              "1px solid #F1F5F9",

            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },

              fontSize: 10,

              color: "#94A3B8",
            }}
          >
            Default report configuration is
            pre-selected.
          </Typography>

          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              onClick={() =>
                setReportDialogOpen(false)
              }
              sx={{
                fontSize: 11,

                fontWeight: 700,

                color: "#64748B",

                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={
                <PrintRounded
                  sx={{
                    fontSize: 17,
                  }}
                />
              }
              onClick={() => {
                setReportDialogOpen(false);

                setTimeout(() => {
                  window.print();
                }, 150);
              }}
              sx={{
                px: 2,

                borderRadius: 2,

                bgcolor: "#2563EB",

                fontSize: 11,

                fontWeight: 700,

                textTransform: "none",

                boxShadow:
                  "0 5px 14px rgba(37,99,235,.18)",

                "&:hover": {
                  bgcolor: "#1D4ED8",
                },
              }}
            >
              Generate Report
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}