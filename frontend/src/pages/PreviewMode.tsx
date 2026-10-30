import { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AccountTreeRounded,
  ArrowBackRounded,
  AssessmentRounded,
  BusinessRounded,
  CalendarMonthRounded,
  DashboardRounded,
  DescriptionRounded,
  Inventory2Rounded,
  LocalShippingRounded,
  MenuRounded,
  MoreHorizRounded,
  NotificationsNoneRounded,
  PaymentsRounded,
  PlaylistAddCheckRounded,
  SettingsRounded,
  ShowChartRounded,
  WorkspacesRounded,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ModuleKey =
  | "dashboard"
  | "projects"
  | "wbs"
  | "pms"
  | "warehouse"
  | "procurement"
  | "cost"
  | "documents"
  | "reports";

const navigation: {
  key: ModuleKey;
  label: string;
  icon: React.ReactNode;
  group: string;
}[] = [
  { key: "dashboard", label: "Executive Dashboard", icon: <DashboardRounded />, group: "WORKSPACE" },
  { key: "projects", label: "Projects", icon: <WorkspacesRounded />, group: "PORTFOLIO" },
  { key: "wbs", label: "WBS Structure", icon: <AccountTreeRounded />, group: "PLANNING & CONTROL" },
  { key: "pms", label: "PMS Schedule", icon: <CalendarMonthRounded />, group: "PLANNING & CONTROL" },
  { key: "cost", label: "Cost Control", icon: <PaymentsRounded />, group: "PLANNING & CONTROL" },
  { key: "warehouse", label: "Warehouse", icon: <Inventory2Rounded />, group: "SUPPLY CHAIN" },
  { key: "procurement", label: "Procurement", icon: <LocalShippingRounded />, group: "SUPPLY CHAIN" },
  { key: "documents", label: "Documents", icon: <DescriptionRounded />, group: "PROJECT SERVICES" },
  { key: "reports", label: "Reports", icon: <AssessmentRounded />, group: "PROJECT SERVICES" },
];

const trend = [
  { period: "Jan", planned: 12, actual: 10 },
  { period: "Feb", planned: 20, actual: 17 },
  { period: "Mar", planned: 29, actual: 25 },
  { period: "Apr", planned: 39, actual: 34 },
  { period: "May", planned: 49, actual: 43 },
  { period: "Jun", planned: 59, actual: 52 },
  { period: "Jul", planned: 69, actual: 61 },
  { period: "Aug", planned: 78, actual: 70 },
];

const projects = [
  { code: "PCS-2401", name: "North Utility Complex", client: "KNG Energy", progress: 72, status: "On Track", budget: "$24.8M" },
  { code: "PCS-2402", name: "Gas Treatment Unit", client: "Pars Industrial", progress: 54, status: "At Risk", budget: "$18.2M" },
  { code: "PCS-2403", name: "Water Transmission Line", client: "Regional Water Co.", progress: 89, status: "On Track", budget: "$9.6M" },
];

const wbsRows = [
  { code: "1", name: "North Utility Complex", level: 0, budget: "$24,800,000", progress: 72, type: "Project" },
  { code: "1.1", name: "Engineering", level: 1, budget: "$2,450,000", progress: 94, type: "WBS" },
  { code: "1.1.1", name: "Process Engineering", level: 2, budget: "$780,000", progress: 100, type: "WBS" },
  { code: "1.1.2", name: "Mechanical Engineering", level: 2, budget: "$920,000", progress: 88, type: "WBS" },
  { code: "1.2", name: "Procurement", level: 1, budget: "$8,300,000", progress: 68, type: "WBS" },
  { code: "1.3", name: "Construction", level: 1, budget: "$11,250,000", progress: 61, type: "WBS" },
  { code: "1.4", name: "Commissioning", level: 1, budget: "$2,800,000", progress: 12, type: "WBS" },
];

const activities = [
  { id: "ENG-001", name: "Issue Process Design Basis", wbs: "1.1.1", start: "04 Aug 2026", finish: "12 Aug 2026", duration: "7d", progress: 100, status: "Completed" },
  { id: "ENG-014", name: "Mechanical Equipment Datasheets", wbs: "1.1.2", start: "10 Aug 2026", finish: "28 Aug 2026", duration: "15d", progress: 88, status: "In Progress" },
  { id: "PRC-022", name: "Main Pumps Purchase Order", wbs: "1.2", start: "18 Aug 2026", finish: "05 Sep 2026", duration: "15d", progress: 65, status: "In Progress" },
  { id: "CON-031", name: "Underground Piping", wbs: "1.3", start: "01 Sep 2026", finish: "20 Oct 2026", duration: "40d", progress: 42, status: "In Progress" },
];

const inventory = [
  { code: "MAT-00182", description: "Centrifugal Pump 6×4", warehouse: "WH-MAIN", available: 8, reserved: 3, unit: "EA", status: "Available" },
  { code: "MAT-00341", description: "Gate Valve 4in Class 300", warehouse: "WH-MAIN", available: 42, reserved: 12, unit: "EA", status: "Available" },
  { code: "MAT-00807", description: "Carbon Steel Pipe DN150", warehouse: "WH-PIPE", available: 120, reserved: 96, unit: "M", status: "Low Stock" },
  { code: "MAT-01022", description: "Instrument Cable 2×2.5", warehouse: "WH-E&I", available: 560, reserved: 210, unit: "M", status: "Available" },
];

const procurement = [
  { po: "PO-260184", vendor: "Atlas Industrial", description: "Main Process Pumps", value: "$485,000", delivery: "18 Nov 2026", status: "Manufacturing" },
  { po: "PO-260191", vendor: "Delta Valves", description: "Isolation Valve Package", value: "$126,500", delivery: "02 Nov 2026", status: "In Transit" },
  { po: "PO-260205", vendor: "Pars Cable", description: "Power & Control Cables", value: "$84,200", delivery: "25 Oct 2026", status: "Delivered" },
];

const formatTitle = (key: ModuleKey) =>
  navigation.find((item) => item.key === key)?.label ?? "PCS Preview";

function MetricCard({ label, value, note, accent }: { label: string; value: string; note: string; accent: string }) {
  return (
    <Paper elevation={0} sx={{ p: 2.25, border: "1px solid #E7EDF5", borderRadius: 3, minWidth: 0 }}>
      <Typography sx={{ color: "#64748B", fontSize: 12, fontWeight: 650 }}>{label}</Typography>
      <Typography sx={{ mt: 1, fontSize: 27, lineHeight: 1.2, fontWeight: 800, color: "#0F172A" }}>{value}</Typography>
      <Typography sx={{ mt: 0.75, fontSize: 11, color: accent, fontWeight: 650 }}>{note}</Typography>
    </Paper>
  );
}

function StatusChip({ value }: { value: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    "On Track": { bg: "#DCFCE7", fg: "#166534" },
    "At Risk": { bg: "#FEF3C7", fg: "#92400E" },
    "Completed": { bg: "#DCFCE7", fg: "#166534" },
    "In Progress": { bg: "#DBEAFE", fg: "#1D4ED8" },
    "Available": { bg: "#DCFCE7", fg: "#166534" },
    "Low Stock": { bg: "#FEF3C7", fg: "#92400E" },
    "Manufacturing": { bg: "#DBEAFE", fg: "#1D4ED8" },
    "In Transit": { bg: "#EDE9FE", fg: "#6D28D9" },
    "Delivered": { bg: "#DCFCE7", fg: "#166534" },
  };
  const color = colors[value] ?? { bg: "#E2E8F0", fg: "#334155" };
  return <Chip size="small" label={value} sx={{ bgcolor: color.bg, color: color.fg, fontWeight: 700, fontSize: 10.5, borderRadius: 1.5 }} />;
}

function DataTable({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#F8FAFC" }}>
            {columns.map((column) => <TableCell key={column} sx={{ color: "#64748B", fontSize: 10.5, fontWeight: 800, whiteSpace: "nowrap", borderBottom: "1px solid #E8EEF5" }}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} hover>
              {row.map((cell, cellIndex) => <TableCell key={cellIndex} sx={{ color: "#334155", fontSize: 11.5, py: 1.4, borderBottom: "1px solid #EEF2F7", whiteSpace: "nowrap" }}>{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function PreviewMode() {
  const [active, setActive] = useState<ModuleKey>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeGroup = useMemo(() => navigation.find((item) => item.key === active)?.group, [active]);

  const content = () => {
    if (active === "projects") {
      return (
        <Paper elevation={0} sx={{ border: "1px solid #E7EDF5", borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Box><Typography fontWeight={800}>Project Portfolio</Typography><Typography color="text.secondary" fontSize={11}>Company-wide project overview and performance</Typography></Box>
            <Chip label="3 Active Projects" color="primary" variant="outlined" />
          </Box>
          <DataTable columns={["PROJECT CODE", "PROJECT", "CLIENT", "BUDGET", "PROGRESS", "STATUS"]} rows={projects.map((p) => [<b>{p.code}</b>, p.name, p.client, p.budget, <Box sx={{ minWidth: 100 }}><Typography fontSize={11} fontWeight={700}>{p.progress}%</Typography><LinearProgress variant="determinate" value={p.progress} sx={{ mt: .5, height: 5, borderRadius: 5 }} /></Box>, <StatusChip value={p.status} />])} />
        </Paper>
      );
    }
    if (active === "wbs") {
      return (
        <Paper elevation={0} sx={{ border: "1px solid #E7EDF5", borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2.5 }}><Typography fontWeight={800}>Work Breakdown Structure</Typography><Typography color="text.secondary" fontSize={11}>Hierarchical scope, budget allocation and weighted progress roll-up</Typography></Box>
          <DataTable columns={["WBS CODE", "DESCRIPTION", "TYPE", "BUDGET", "WEIGHTED PROGRESS"]} rows={wbsRows.map((r) => [<b>{r.code}</b>, <Box sx={{ pl: r.level * 2, fontWeight: r.level < 2 ? 700 : 500 }}>{r.name}</Box>, <Chip size="small" label={r.type} variant="outlined" />, r.budget, <Box sx={{ minWidth: 110 }}><Typography fontSize={11} fontWeight={700}>{r.progress}%</Typography><LinearProgress variant="determinate" value={r.progress} sx={{ mt: .5, height: 5, borderRadius: 5 }} /></Box>])} />
        </Paper>
      );
    }
    if (active === "pms") {
      return (
        <Stack spacing={2}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}><Chip icon={<CalendarMonthRounded />} label="Data Date: 31 Oct 2026" /><Chip label="Baseline: BL-01 Approved" color="success" variant="outlined" /><Chip label="Calendar: 6 Days / Week" variant="outlined" /></Box>
          <Paper elevation={0} sx={{ border: "1px solid #E7EDF5", borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ p: 2.5 }}><Typography fontWeight={800}>Project Schedule — Activity Register</Typography><Typography color="text.secondary" fontSize={11}>WBS-linked activities, dates, duration and physical progress</Typography></Box>
            <DataTable columns={["ACTIVITY ID", "ACTIVITY DESCRIPTION", "WBS", "START", "FINISH", "DURATION", "PROGRESS", "STATUS"]} rows={activities.map((a) => [<b>{a.id}</b>, a.name, a.wbs, a.start, a.finish, a.duration, <b>{a.progress}%</b>, <StatusChip value={a.status} />])} />
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E7EDF5", borderRadius: 3 }}>
            <Typography fontWeight={800} mb={1.5}>Schedule Performance Snapshot</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 1.5 }}>
              <MetricCard label="Planned Progress" value="78.0%" note="Baseline curve" accent="#64748B" />
              <MetricCard label="Actual Progress" value="70.0%" note="8.0% behind plan" accent="#D97706" />
              <MetricCard label="SPI" value="0.90" note="Schedule performance" accent="#D97706" />
              <MetricCard label="Critical Activities" value="18" note="4 near-critical" accent="#DC2626" />
            </Box>
          </Paper>
        </Stack>
      );
    }
    if (active === "warehouse") {
      return <Paper elevation={0} sx={{ border: "1px solid #E7EDF5", borderRadius: 3, overflow: "hidden" }}><Box sx={{ p: 2.5 }}><Typography fontWeight={800}>Warehouse Inventory</Typography><Typography color="text.secondary" fontSize={11}>Stock availability, reservations and material status</Typography></Box><DataTable columns={["MATERIAL CODE", "DESCRIPTION", "WAREHOUSE", "AVAILABLE", "RESERVED", "UNIT", "STATUS"]} rows={inventory.map((r) => [<b>{r.code}</b>, r.description, r.warehouse, r.available, r.reserved, r.unit, <StatusChip value={r.status} />])} /></Paper>;
    }
    if (active === "procurement") {
      return <Paper elevation={0} sx={{ border: "1px solid #E7EDF5", borderRadius: 3, overflow: "hidden" }}><Box sx={{ p: 2.5 }}><Typography fontWeight={800}>Procurement Register</Typography><Typography color="text.secondary" fontSize={11}>Purchase orders and vendor delivery tracking</Typography></Box><DataTable columns={["PO NUMBER", "VENDOR", "DESCRIPTION", "PO VALUE", "DELIVERY DATE", "STATUS"]} rows={procurement.map((r) => [<b>{r.po}</b>, r.vendor, r.description, r.value, r.delivery, <StatusChip value={r.status} />])} /></Paper>;
    }
    if (active === "cost") {
      return <Stack spacing={2}><Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 1.5 }}><MetricCard label="Budget at Completion" value="$24.8M" note="Approved control budget" accent="#64748B" /><MetricCard label="Earned Value" value="$17.4M" note="70.0% physical progress" accent="#2563EB" /><MetricCard label="Actual Cost" value="$18.1M" note="Cost variance: -$0.7M" accent="#D97706" /><MetricCard label="CPI" value="0.96" note="Cost efficiency" accent="#D97706" /></Box><Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E7EDF5", borderRadius: 3 }}><Typography fontWeight={800}>Cost Control Overview</Typography><Typography color="text.secondary" fontSize={11} mt={.5}>Illustrative EVM indicators — sample data only</Typography><Box sx={{ mt: 2 }}><LinearProgress variant="determinate" value={70} sx={{ height: 10, borderRadius: 8 }} /><Typography fontSize={11} color="text.secondary" mt={1}>Earned value against approved budget: 70%</Typography></Box></Paper></Stack>;
    }
    if (active === "documents") {
      return <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E7EDF5", borderRadius: 3 }}><Typography fontWeight={800}>Document Register</Typography><Typography color="text.secondary" fontSize={11} mt={.5}>Document control and transmittal workspace preview</Typography><Box sx={{ mt: 2, display: "grid", gap: 1 }}><Chip icon={<DescriptionRounded />} label="Engineering Deliverables — 248 documents" variant="outlined" sx={{ justifyContent: "flex-start", p: 2 }} /><Chip icon={<DescriptionRounded />} label="Vendor Documents — 96 documents" variant="outlined" sx={{ justifyContent: "flex-start", p: 2 }} /><Chip icon={<DescriptionRounded />} label="Construction Records — 412 documents" variant="outlined" sx={{ justifyContent: "flex-start", p: 2 }} /></Box></Paper>;
    }
    if (active === "reports") {
      return <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E7EDF5", borderRadius: 3 }}><Typography fontWeight={800}>Project Reports</Typography><Typography color="text.secondary" fontSize={11} mt={.5}>Sample report catalogue</Typography><Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 1.5 }}>{["Executive Project Status", "PMS Activity Register", "WBS Progress & Weight", "EVM Cost Performance", "Procurement Status", "Warehouse Stock Summary"].map((name) => <Paper key={name} variant="outlined" sx={{ p: 2, borderRadius: 2 }}><AssessmentRounded color="primary" /><Typography fontWeight={700} fontSize={12} mt={1}>{name}</Typography><Typography color="text.secondary" fontSize={10} mt={.5}>Preview report template</Typography></Paper>)}</Box></Paper>;
    }
    return (
      <Stack spacing={2.5}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 1.5 }}>
          <MetricCard label="Active Projects" value="12" note="+2 this quarter" accent="#16A34A" />
          <MetricCard label="Portfolio Progress" value="68.4%" note="Weighted physical progress" accent="#2563EB" />
          <MetricCard label="Approved Budget" value="$86.2M" note="Across active projects" accent="#64748B" />
          <MetricCard label="Open Risks" value="07" note="2 high priority" accent="#D97706" />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0,1.65fr) minmax(280px,1fr)" }, gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E7EDF5", borderRadius: 3, minWidth: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}><Box><Typography fontWeight={800}>Portfolio Progress Trend</Typography><Typography color="text.secondary" fontSize={11}>Planned vs actual cumulative progress</Typography></Box><Chip size="small" label="Jan – Aug 2026" variant="outlined" /></Box>
            <Box sx={{ width: "100%", height: 245, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="plannedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93C5FD" stopOpacity={.45} /><stop offset="100%" stopColor="#93C5FD" stopOpacity={0} /></linearGradient><linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={.25} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#EEF2F7" vertical={false} /><XAxis dataKey="period" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} unit="%" /><Tooltip /><Area type="monotone" dataKey="planned" name="Planned" stroke="#94A3B8" strokeWidth={2} fill="url(#plannedFill)" /><Area type="monotone" dataKey="actual" name="Actual" stroke="#2563EB" strokeWidth={2.5} fill="url(#actualFill)" /></AreaChart></ResponsiveContainer>
            </Box>
            <Stack direction="row" spacing={2} mt={1}><Chip size="small" label="Planned" variant="outlined" /><Chip size="small" label="Actual" color="primary" variant="outlined" /></Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid #E7EDF5", borderRadius: 3 }}>
            <Typography fontWeight={800}>Portfolio Health</Typography><Typography color="text.secondary" fontSize={11}>Current project status distribution</Typography>
            {[["On Track", 8, "#16A34A"], ["At Risk", 3, "#D97706"], ["Delayed", 1, "#DC2626"]].map(([label, count, color]) => <Box key={String(label)} sx={{ mt: 2.3 }}><Box sx={{ display: "flex", justifyContent: "space-between", mb: .7 }}><Typography fontSize={12} fontWeight={650}>{label}</Typography><Typography fontSize={12} fontWeight={800}>{count}</Typography></Box><LinearProgress variant="determinate" value={Number(count) / 12 * 100} sx={{ height: 8, borderRadius: 5, bgcolor: "#F1F5F9", "& .MuiLinearProgress-bar": { bgcolor: String(color), borderRadius: 5 } }} /></Box>)}
            <Divider sx={{ my: 2.5 }} /><Typography fontSize={11} color="text.secondary">Portfolio status is based on illustrative sample values.</Typography>
          </Paper>
        </Box>
        <Paper elevation={0} sx={{ border: "1px solid #E7EDF5", borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2.5, display: "flex", justifyContent: "space-between", gap: 1 }}><Box><Typography fontWeight={800}>Priority Projects</Typography><Typography color="text.secondary" fontSize={11}>Project delivery overview</Typography></Box><Button size="small" onClick={() => setActive("projects")}>View portfolio</Button></Box>
          <DataTable columns={["PROJECT", "CLIENT", "BUDGET", "PROGRESS", "STATUS"]} rows={projects.map((p) => [<Box><Typography fontWeight={750} fontSize={11}>{p.name}</Typography><Typography color="text.secondary" fontSize={10}>{p.code}</Typography></Box>, p.client, p.budget, <Box sx={{ minWidth: 95 }}><Typography fontSize={11} fontWeight={700}>{p.progress}%</Typography><LinearProgress variant="determinate" value={p.progress} sx={{ mt: .5, height: 5, borderRadius: 5 }} /></Box>, <StatusChip value={p.status} />])} />
        </Paper>
      </Stack>
    );
  };

  const groups = [...new Set(navigation.map((item) => item.group))];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F6F8FB", color: "#0F172A", display: "flex" }}>
      <Box sx={{ width: { xs: mobileNavOpen ? 260 : 0, md: 260 }, flexShrink: 0, overflow: "hidden", transition: "width .2s ease", position: { xs: "fixed", md: "relative" }, zIndex: 20, height: "100vh", bgcolor: "#0F172A", color: "#E2E8F0" }}>
        <Box sx={{ px: 2.5, py: 2.4, display: "flex", alignItems: "center", gap: 1.4 }}>
          <Avatar variant="rounded" sx={{ bgcolor: "#2563EB", width: 38, height: 38, fontWeight: 900 }}>P</Avatar>
          <Box><Typography fontWeight={900} letterSpacing={1.2} color="#fff">PCS</Typography><Typography fontSize={9} color="#94A3B8" letterSpacing={1}>PROJECT CONTROL SUITE</Typography></Box>
        </Box>
        <Divider sx={{ borderColor: "#263449" }} />
        <Box sx={{ px: 1.3, py: 2, overflowY: "auto", height: "calc(100vh - 82px)" }}>
          {groups.map((group) => <Box key={group} sx={{ mb: 2.2 }}><Typography sx={{ px: 1.2, mb: .8, color: "#718096", fontSize: 9, fontWeight: 800, letterSpacing: 1.1 }}>{group}</Typography>{navigation.filter((item) => item.group === group).map((item) => <Button key={item.key} fullWidth onClick={() => { setActive(item.key); setMobileNavOpen(false); }} startIcon={item.icon} sx={{ justifyContent: "flex-start", textTransform: "none", color: active === item.key ? "#fff" : "#AAB7C8", bgcolor: active === item.key ? "#1E40AF" : "transparent", borderRadius: 2, px: 1.4, py: 1, mb: .35, fontSize: 11.5, fontWeight: active === item.key ? 750 : 550, "& .MuiButton-startIcon": { color: active === item.key ? "#BFDBFE" : "#8DA0B8" }, "&:hover": { bgcolor: "#1E293B" } }}>{item.label}</Button>)}</Box>)}
          <Divider sx={{ borderColor: "#263449", my: 1.5 }} />
          <Button fullWidth startIcon={<SettingsRounded />} sx={{ justifyContent: "flex-start", color: "#AAB7C8", textTransform: "none", fontSize: 11.5 }}>Settings</Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "#fff", color: "#0F172A", borderBottom: "1px solid #E7EDF5" }}>
          <Toolbar sx={{ minHeight: "66px !important", px: { xs: 1.5, md: 3 }, gap: 1.5 }}>
            <IconButton onClick={() => setMobileNavOpen(!mobileNavOpen)} sx={{ display: { md: "none" } }}><MenuRounded /></IconButton>
            <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={800} fontSize={14}>{formatTitle(active)}</Typography><Typography color="text.secondary" fontSize={10}>{activeGroup} / NORTH UTILITY COMPLEX</Typography></Box>
            <Chip size="small" label="DEMO • READ ONLY" color="warning" sx={{ fontWeight: 800, fontSize: 9.5 }} />
            <IconButton size="small"><NotificationsNoneRounded /></IconButton>
            <Avatar sx={{ width: 30, height: 30, bgcolor: "#DBEAFE", color: "#1D4ED8", fontSize: 11, fontWeight: 800 }}>DM</Avatar>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 1.5, sm: 2.5, lg: 3.5 }, maxWidth: 1600, mx: "auto" }}>
          <Paper elevation={0} sx={{ mb: 2.5, px: 2, py: 1.3, border: "1px solid #FDE68A", bgcolor: "#FFFBEB", borderRadius: 2, display: "flex", alignItems: "center", gap: 1.2 }}>
            <PlaylistAddCheckRounded sx={{ color: "#B45309", fontSize: 19 }} />
            <Typography sx={{ fontSize: 11, color: "#92400E", flex: 1 }}>You are viewing a read-only product preview. All records and KPIs are fictional sample data; no backend or live project database is connected.</Typography>
            <Chip size="small" label="Sample data" sx={{ display: { xs: "none", sm: "flex" }, bgcolor: "#FEF3C7", color: "#92400E", fontSize: 9, fontWeight: 800 }} />
          </Paper>
          <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, mb: 2.5, flexDirection: { xs: "column", sm: "row" } }}>
            <Box><Typography sx={{ fontSize: 21, fontWeight: 850, letterSpacing: -.4 }}>{active === "dashboard" ? "Project Control Overview" : formatTitle(active)}</Typography><Typography color="text.secondary" fontSize={11} mt={.5}>North Utility Complex • PCS-2401 • KNG Energy</Typography></Box>
            <Stack direction="row" spacing={1}><Chip size="small" icon={<BusinessRounded />} label="KNG Energy" variant="outlined" /><Chip size="small" icon={<ShowChartRounded />} label="Reporting Period: Aug 2026" variant="outlined" /></Stack>
          </Box>
          {content()}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <Typography color="text.secondary" fontSize={9.5}>PCS • Project Control Suite • Preview Build</Typography>
            <Button size="small" startIcon={<ArrowBackRounded />} href="/login" sx={{ textTransform: "none", fontSize: 10.5 }}>Back to sign in</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
