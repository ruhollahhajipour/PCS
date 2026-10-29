import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const kpis = [
  { label: "Active projects", value: "12", detail: "Across 4 plants", color: "#2563EB" },
  { label: "Total budget", value: "$248.6M", detail: "Illustrative portfolio", color: "#7C3AED" },
  { label: "Overall progress", value: "64.8%", detail: "Weighted physical progress", color: "#059669" },
  { label: "Open issues", value: "37", detail: "12 high priority", color: "#D97706" },
];

const progress = [
  { month: "Jan", planned: 18, actual: 16 },
  { month: "Feb", planned: 25, actual: 22 },
  { month: "Mar", planned: 33, actual: 29 },
  { month: "Apr", planned: 41, actual: 37 },
  { month: "May", planned: 49, actual: 44 },
  { month: "Jun", planned: 57, actual: 52 },
  { month: "Jul", planned: 65, actual: 61 },
  { month: "Aug", planned: 72, actual: 65 },
];

const projectStatus = [
  { name: "On track", value: 7, color: "#16A34A" },
  { name: "At risk", value: 3, color: "#F59E0B" },
  { name: "Delayed", value: 2, color: "#DC2626" },
];

const activities = [
  { title: "Mechanical package — progress updated", project: "North Utilities", time: "Today · 10:42" },
  { title: "Baseline schedule submitted for review", project: "Gas Treatment Unit", time: "Today · 09:15" },
  { title: "Procurement milestone approaching", project: "Offsites & Utilities", time: "Yesterday · 16:30" },
];

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ color: "#0F172A", fontWeight: 750, fontSize: 16 }}>{title}</Typography>
      {subtitle && <Typography sx={{ color: "#64748B", fontSize: 12, mt: 0.35 }}>{subtitle}</Typography>}
    </Box>
  );
}

export default function PreviewPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F6F8FB", color: "#0F172A", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1440, mx: "auto" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography sx={{ color: "#2563EB", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>PCS · Project Control System</Typography>
            <Typography component="h1" sx={{ fontSize: { xs: 25, md: 31 }, fontWeight: 800, mt: 0.5 }}>Executive Dashboard</Typography>
            <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: 13 }}>Portfolio overview · Sample EPC project data</Typography>
          </Box>
          <Chip label="PREVIEW MODE · NO API REQUIRED" sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 800, borderRadius: 2 }} />
        </Stack>

        <Box sx={{ p: 1.5, mb: 3, border: "1px solid #FDE68A", bgcolor: "#FFFBEB", borderRadius: 2 }}>
          <Typography sx={{ color: "#92400E", fontSize: 12, lineHeight: 1.7 }}>
            This is an isolated visual preview. All figures, project names and activities on this page are fictional sample data; no backend, login, database or live PCS records are used.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, minmax(0, 1fr))" }, gap: 2, mb: 3 }}>
          {kpis.map((item) => (
            <Card key={item.label} elevation={0} sx={{ border: "1px solid #E7ECF3", borderRadius: 3, minWidth: 0 }}>
              <CardContent sx={{ p: 2.25, "&:last-child": { pb: 2.25 } }}>
                <Box sx={{ width: 34, height: 4, bgcolor: item.color, borderRadius: 4, mb: 2 }} />
                <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 600 }}>{item.label}</Typography>
                <Typography sx={{ fontSize: { xs: 22, md: 27 }, fontWeight: 800, mt: 0.6, letterSpacing: "-0.03em" }}>{item.value}</Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: 11, mt: 0.5 }}>{item.detail}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.8fr) minmax(300px, 1fr)" }, gap: 2, mb: 2 }}>
          <Card elevation={0} sx={{ border: "1px solid #E7ECF3", borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionTitle title="Progress performance" subtitle="Cumulative planned vs. actual progress · illustrative %" />
              <Box sx={{ height: 280, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progress} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="previewPlanned" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93C5FD" stopOpacity={0.35} /><stop offset="95%" stopColor="#93C5FD" stopOpacity={0.02} /></linearGradient>
                      <linearGradient id="previewActual" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.24} /><stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="planned" name="Planned" stroke="#94A3B8" strokeDasharray="5 4" fill="url(#previewPlanned)" strokeWidth={2} />
                    <Area type="monotone" dataKey="actual" name="Actual" stroke="#2563EB" fill="url(#previewActual)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: "1px solid #E7ECF3", borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionTitle title="Project status" subtitle="12 sample projects in the portfolio" />
              <Box sx={{ height: 205, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={projectStatus} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={4} stroke="none">
                      {projectStatus.map((item) => <Cell key={item.name} fill={item.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", pointerEvents: "none" }}>
                  <Typography sx={{ fontSize: 28, fontWeight: 800 }}>12</Typography>
                  <Typography sx={{ fontSize: 10, color: "#94A3B8" }}>PROJECTS</Typography>
                </Box>
              </Box>
              <Stack spacing={1.2} sx={{ mt: 1 }}>
                {projectStatus.map((item) => (
                  <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center"><Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} /><Typography sx={{ fontSize: 12, color: "#475569" }}>{item.name}</Typography></Stack>
                    <Typography sx={{ fontSize: 12, fontWeight: 750 }}>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Card elevation={0} sx={{ border: "1px solid #E7ECF3", borderRadius: 3 }}>
          <CardContent sx={{ p: 2.5 }}>
            <SectionTitle title="Recent activity" subtitle="Illustrative activity feed · not connected to a live system" />
            <Stack divider={<Box sx={{ borderBottom: "1px solid #F1F5F9" }} />} spacing={0}>
              {activities.map((activity) => (
                <Stack key={activity.title} direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={0.5} sx={{ py: 1.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 650 }}>{activity.title}</Typography>
                    <Typography sx={{ color: "#94A3B8", fontSize: 11, mt: 0.35 }}>{activity.project}</Typography>
                  </Box>
                  <Typography sx={{ color: "#94A3B8", fontSize: 11 }}>{activity.time}</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Typography sx={{ color: "#94A3B8", fontSize: 10, textAlign: "center", mt: 3 }}>PCS visual preview · sample data only · authenticated application routes remain protected</Typography>
      </Box>
    </Box>
  );
}
