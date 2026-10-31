import { useEffect, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWalletRounded,
  AssessmentRounded,
  AutorenewRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  EngineeringRounded,
  InsightsRounded,
  PrintRounded,
  ScheduleRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useWorkspace } from "../../../context/WorkspaceContext";
import {
  getPmsDashboard,
  type PmsDashboard,
} from "../../pms/api/pmsApi";

function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value: number): string {
  return `${formatNumber(value)}٪`;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        background: "#FFFFFF",
      }}
    >
      <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 650 }}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: accent,
              bgcolor: `${accent}14`,
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Typography
          sx={{
            mt: 1.5,
            color: "#0F172A",
            fontSize: { xs: 23, md: 27 },
            lineHeight: 1.2,
            fontWeight: 850,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </Typography>
        <Typography sx={{ mt: 0.75, color: "#94A3B8", fontSize: 10.5 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { workspace } = useWorkspace();
  const project = workspace.project;
  const projectId = project.id;

  const [dashboard, setDashboard] = useState<PmsDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      if (!projectId) {
        setDashboard(null);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getPmsDashboard(projectId);
        if (active) {
          setDashboard(result);
        }
      } catch (requestError: unknown) {
        if (!active) return;

        setDashboard(null);
        const candidate = requestError as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = candidate.response?.status;

        if (status === 401) {
          setError("نشست شما معتبر نیست. لطفاً دوباره وارد PCS شوید.");
        } else if (status === 403) {
          setError("مجوز مشاهده داشبورد این پروژه برای حساب شما صادر نشده است.");
        } else if (status === 404) {
          setError("برای پروژه انتخاب‌شده اطلاعات داشبورد پیدا نشد.");
        } else {
          setError(
            candidate.response?.data?.message ??
              "دریافت اطلاعات داشبورد از سرویس PCS با خطا مواجه شد."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [projectId, refreshKey]);

  const hasProject = Boolean(projectId);
  const progress = dashboard
    ? Math.max(0, Math.min(100, dashboard.progress))
    : 0;

  return (
    <Box
      dir="rtl"
      className="pcs-dashboard"
      sx={{
        width: "100%",
        maxWidth: 1800,
        mx: "auto",
        pb: 3,
        color: "#0F172A",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        gap={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 22, md: 29 },
              fontWeight: 850,
              letterSpacing: "-0.03em",
              color: "#0F172A",
            }}
          >
            داشبورد مدیریتی
          </Typography>
          <Typography sx={{ mt: 0.65, color: "#64748B", fontSize: 12 }}>
            {project.name || "پروژه‌ای انتخاب نشده"}
            {project.code ? ` · ${project.code}` : ""}
          </Typography>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ScheduleRounded />}
            onClick={() => navigate(projectId ? `/projects/${projectId}/schedule` : "/projects")}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            برنامه زمان‌بندی
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintRounded />}
            onClick={() => window.print()}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            چاپ داشبورد
          </Button>
          <Button
            variant="contained"
            startIcon={<AutorenewRounded />}
            disabled={!hasProject || loading}
            onClick={() => setRefreshKey((value) => value + 1)}
            sx={{
              bgcolor: "#2563EB",
              borderRadius: 2,
              fontSize: 12,
              fontWeight: 750,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#1D4ED8", boxShadow: "none" },
            }}
          >
            به‌روزرسانی
          </Button>
        </Stack>
      </Stack>

      {!hasProject && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={() => navigate("/projects")}>
              انتخاب پروژه
            </Button>
          }
          sx={{ mb: 2, borderRadius: 2, alignItems: "center" }}
        >
          برای مشاهده شاخص‌های واقعی، ابتدا یک پروژه را در فضای کاری انتخاب کنید.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Card
          elevation={0}
          sx={{
            mb: 2,
            p: 3,
            border: "1px solid #E2E8F0",
            borderRadius: 3,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" gap={1.5}>
            <CircularProgress size={20} />
            <Typography sx={{ color: "#64748B", fontSize: 12 }}>
              در حال دریافت اطلاعات واقعی پروژه از PCS...
            </Typography>
          </Stack>
        </Card>
      )}

      {dashboard && !loading && (
        <>
          <Card
            elevation={0}
            sx={{
              mb: 2.5,
              border: "1px solid #DBEAFE",
              borderRadius: 3,
              background: "linear-gradient(115deg, #FFFFFF 0%, #F1F6FF 100%)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "center" }}
                justifyContent="space-between"
                gap={2.5}
              >
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                    <CheckCircleRounded sx={{ color: "#0F9F75", fontSize: 19 }} />
                    <Typography sx={{ color: "#334155", fontSize: 12, fontWeight: 750 }}>
                      وضعیت پیشرفت پروژه
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="baseline" gap={1}>
                    <Typography sx={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>
                      {formatPercent(progress)}
                    </Typography>
                    <Typography sx={{ color: "#64748B", fontSize: 11 }}>
                      پیشرفت ثبت‌شده در سامانه
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      mt: 1.5,
                      height: 9,
                      borderRadius: 10,
                      bgcolor: "#DBEAFE",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 10,
                        bgcolor: "#2563EB",
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: { md: 210 },
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Typography sx={{ color: "#64748B", fontSize: 10.5 }}>
                    فعالیت‌های ثبت‌شده
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 23, fontWeight: 850 }}>
                    {formatNumber(dashboard.completedActivities, 0)}
                    <Typography component="span" sx={{ color: "#94A3B8", fontSize: 13, fontWeight: 600 }}>
                      {" "}از {formatNumber(dashboard.totalActivities, 0)}
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1.75,
              mb: 2.5,
            }}
          >
            <MetricCard
              title="بودجه مصوب"
              value={formatNumber(dashboard.budget, 0)}
              subtitle="واحد پول مطابق تنظیمات پروژه"
              accent="#2563EB"
              icon={<AccountBalanceWalletRounded fontSize="small" />}
            />
            <MetricCard
              title="هزینه واقعی"
              value={formatNumber(dashboard.actualCost, 0)}
              subtitle="هزینه ثبت‌شده تا تاریخ گزارش"
              accent="#0F766E"
              icon={<AssessmentRounded fontSize="small" />}
            />
            <MetricCard
              title="ارزش کسب‌شده (EV)"
              value={formatNumber(dashboard.earnedValue, 0)}
              subtitle="بر مبنای پیشرفت و وزن فعالیت‌ها"
              accent="#7C3AED"
              icon={<EngineeringRounded fontSize="small" />}
            />
            <MetricCard
              title="شاخص عملکرد زمان (SPI)"
              value={formatNumber(dashboard.spi, 2)}
              subtitle={dashboard.spi >= 1 ? "مطابق یا جلوتر از برنامه" : "عقب‌ماندگی نسبت به برنامه"}
              accent={dashboard.spi >= 1 ? "#0F9F75" : "#D97706"}
              icon={<InsightsRounded fontSize="small" />}
            />
          </Box>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: 3,
              background: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 2 }}>
                شاخص‌های کنترل عملکرد
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "#64748B", fontSize: 11 }}>
                      شاخص عملکرد هزینه (CPI)
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 14, color: dashboard.cpi >= 1 ? "#0F9F75" : "#D97706" }}>
                      {formatNumber(dashboard.cpi, 2)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, dashboard.cpi * 100))}
                    sx={{ mt: 1, height: 7, borderRadius: 8, bgcolor: "#E2E8F0" }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "#64748B", fontSize: 11 }}>
                      شاخص عملکرد زمان‌بندی (SPI)
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 14, color: dashboard.spi >= 1 ? "#0F9F75" : "#D97706" }}>
                      {formatNumber(dashboard.spi, 2)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, Math.max(0, dashboard.spi * 100))}
                    sx={{ mt: 1, height: 7, borderRadius: 8, bgcolor: "#E2E8F0" }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {!loading && hasProject && !dashboard && !error && (
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          هنوز داده‌ای برای نمایش داشبورد این پروژه در سرویس PMS دریافت نشده است.
        </Alert>
      )}

      <Box
        sx={{
          mt: 2,
          pt: 1.5,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: 0.75,
        }}
      >
        <CalendarMonthRounded sx={{ color: "#94A3B8", fontSize: 15 }} />
        <Typography sx={{ color: "#94A3B8", fontSize: 10 }}>
          مقادیر این صفحه مستقیماً از API داشبورد PMS دریافت می‌شوند؛ در صورت نبود داده، عدد ساختگی نمایش داده نمی‌شود.
        </Typography>
      </Box>

      <style>
        {`
          @media print {
            body { background: #fff !important; }
            .pcs-dashboard button { display: none !important; }
          }
        `}
      </style>
    </Box>
  );
}
