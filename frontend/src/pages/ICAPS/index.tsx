import { Box, Chip, Grid, Link, Paper, Step, StepContent, StepLabel, Stepper, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

import { ICAPS_SOURCES, INPUTS, MODULES, OUTPUTS, PHASES, ROLES, WORKFLOW } from "./data";

const paperSx = { borderRadius: "16px", boxShadow: "0 12px 35px rgba(15,23,42,.08)", p: 3 } as const;

function Cards({ rows }: { rows: { title: string; text: string }[] }) {
  return (
    <Grid container spacing={2}>
      {rows.map((r) => (
        <Grid key={r.title} size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={0} sx={{ ...paperSx, height: "100%" }}>
            <Typography sx={{ fontWeight: 700, color: "#16355B", mb: 0.5 }}>{r.title}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14, lineHeight: 1.9 }}>{r.text}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

const TABS = ["معرفی", "نحوهٔ کار", "ورودی‌ها", "خروجی‌ها", "OPERCOM و گواهی‌ها", "منابع"];

export default function ICAPS() {
  const [tab, setTab] = useState(0);
  return (
    <Box dir="rtl" sx={{ fontFamily: "Vazirmatn, sans-serif", textAlign: "right" }}>
      <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#16355B" }}>ICAPS</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Integrated Commissioning And Progress System — سیستم یکپارچه راه‌اندازی و پیگیری پیشرفت
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3, borderBottom: "1px solid #D5DEEC" }}>
        {TABS.map((t) => <Tab key={t} label={t} sx={{ fontWeight: 600, textTransform: "none" }} />)}
      </Tabs>

      {tab === 0 && (
        <Box>
          <Paper elevation={0} sx={{ ...paperSx, mb: 2 }}>
            <Typography sx={{ lineHeight: 2 }}>
              ICAPS© نرم‌افزار وب‌محور شرکت TotalEnergies برای برنامه‌ریزی، اجرا و پایش فعالیت‌های
              <b> تکمیل مکانیکی (پیش‌راه‌اندازی)</b> و <b>راه‌اندازی (Commissioning)</b> است و بر پایهٔ روش
              OPERCOM™ کار می‌کند. به‌صورت یک اپلیکیشن وب یکپارچه همراه با اپ تبلت (اندروید ۸ به بالا) ارائه می‌شود
              و مستندات را بدون کاغذ و با امضای الکترونیک نگه می‌دارد.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: 13 }}>
              نکته: در پروژه‌های نفت و گاز، ICAPS یعنی همین نرم‌افزار تکمیل و راه‌اندازی. اگر منظور شما نرم‌افزار دیگری بود بگویید تا اصلاح شود.
            </Typography>
          </Paper>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>نقش‌ها</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {ROLES.map((r) => (
              <Grid key={r.key} size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ ...paperSx, height: "100%" }}>
                  <Typography sx={{ fontWeight: 700 }}>{r.title}</Typography>
                  <Chip size="small" label={r.channel} sx={{ my: 1 }} />
                  <Box component="ul" sx={{ m: 0, pr: 2.5, color: "text.secondary", lineHeight: 2 }}>
                    {r.duties.map((d) => <li key={d}>{d}</li>)}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>ماژول‌ها</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {MODULES.map((m) => <Chip key={m} label={m} variant="outlined" />)}
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Paper elevation={0} sx={paperSx}>
          <Stepper orientation="vertical" activeStep={-1}>
            {WORKFLOW.map((s, i) => (
              <Step key={s.title} active expanded>
                <StepLabel><b>{i + 1}. {s.title}</b></StepLabel>
                <StepContent><Typography color="text.secondary" sx={{ lineHeight: 1.9 }}>{s.text}</Typography></StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {tab === 2 && <Cards rows={INPUTS} />}
      {tab === 3 && <Cards rows={OUTPUTS} />}

      {tab === 4 && (
        <Grid container spacing={2}>
          {PHASES.map((p) => (
            <Grid key={p.title} size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...paperSx, height: "100%" }}>
                <Typography sx={{ fontWeight: 700, color: "#16355B" }}>{p.title}</Typography>
                <Typography color="text.secondary" sx={{ my: 1 }}>تمرکز: {p.focus}</Typography>
                <Box component="ul" sx={{ m: 0, pr: 2.5, lineHeight: 2 }}>{p.items.map((x) => <li key={x}>{x}</li>)}</Box>
                <Chip color="primary" label={`گواهی: ${p.cert}`} sx={{ mt: 2 }} />
                <Typography sx={{ mt: 1.5, lineHeight: 1.9 }}>{p.punch}</Typography>
              </Paper>
            </Grid>
          ))}
          <Grid size={12}>
            <Paper elevation={0} sx={paperSx}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>دسته‌بندی Punch List</Typography>
              <Typography sx={{ lineHeight: 2 }}>
                موارد ناموفق در Punch List با اولویت A، B یا C ثبت می‌شوند. دستهٔ A مانع صدور RFC و دستهٔ B مانع صدور AOC است.
                الزام دستهٔ C در منبع مورد استفاده توضیح داده نشده بود.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 5 && (
        <Paper elevation={0} sx={paperSx}>
          <Box component="ul" sx={{ m: 0, pr: 2.5, lineHeight: 2.2 }}>
            {ICAPS_SOURCES.map((s) => (
              <li key={s.url}><Link href={s.url} target="_blank" rel="noreferrer" dir="ltr">{s.title}</Link></li>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
