import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { useState } from "react";

import { WarehouseService } from "../../services/warehouse.service";
import DocumentList from "./DocumentList";
import ItemsTab from "./ItemsTab";
import Kardex from "./Kardex";
import Overview from "./Overview";
import StockReport from "./StockReport";
import WarehousesTab from "./WarehousesTab";
import { ConfirmDialog, Toast, useConfirm } from "./ui";
import { useToast } from "./hooks";

const TABS = [
  "نمای کلی",
  "رسید انبار",
  "حواله انبار",
  "انتقال بین انبارها",
  "انبارگردانی",
  "کاردکس کالا",
  "موجودی کالا",
  "کالاها",
  "انبارها",
] as const;

export default function WarehousePage() {
  const [tab, setTab] = useState(0);
  const { toast, notify, close } = useToast();
  const reset = useConfirm<true>();

  return (
    <Box dir="rtl" sx={{ fontFamily: "Vazirmatn, sans-serif" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#16355B" }}>انبار</Typography>
          <Typography color="text.secondary">رسید، حواله، انتقال، انبارگردانی و کاردکس کالا</Typography>
        </Box>
        <Button size="small" startIcon={<RestartAltRoundedIcon />} onClick={() => reset.ask(true)}>
          بازنشانی داده‌های نمونه
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
        sx={{ mb: 3, borderBottom: "1px solid #D5DEEC" }}>
        {TABS.map((t) => <Tab key={t} label={t} sx={{ fontWeight: 600, textTransform: "none" }} />)}
      </Tabs>

      {tab === 0 && <Overview />}
      {tab === 1 && <DocumentList type="Receipt" notify={notify} />}
      {tab === 2 && <DocumentList type="Issue" notify={notify} />}
      {tab === 3 && <DocumentList type="Transfer" notify={notify} />}
      {tab === 4 && <DocumentList type="Count" notify={notify} />}
      {tab === 5 && <Kardex />}
      {tab === 6 && <StockReport />}
      {tab === 7 && <ItemsTab notify={notify} />}
      {tab === 8 && <WarehousesTab notify={notify} />}

      <ConfirmDialog
        open={!!reset.pending} title="بازنشانی داده‌های نمونه"
        message="تمام کالاها، انبارها و اسناد فعلی پاک و داده‌های نمونه جایگزین می‌شود. ادامه می‌دهید؟"
        confirmLabel="بازنشانی" danger
        onConfirm={() => { WarehouseService.resetDemoData(); reset.clear(); notify("داده‌های نمونه بازنشانی شد.", "info"); }}
        onClose={reset.clear}
      />
      <Toast toast={toast} onClose={close} />
    </Box>
  );
}
