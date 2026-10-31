import type { ReactNode } from "react";

import { Box, Paper } from "@mui/material";

import CRUDHeader from "./CRUDHeader";
import CRUDToolbar from "./CRUDToolbar";

type CRUDPageProps = {
  title: string;
  subtitle?: string;

  search: string;
  onSearchChange: (value: string) => void;

  addLabel?: string;
  searchPlaceholder?: string;

  onAdd: () => void;

  children: ReactNode;
};

export default function CRUDPage({
  title,
  subtitle,

  search,
  onSearchChange,

  addLabel = "New",

  searchPlaceholder = "Search...",

  onAdd,

  children,
}: CRUDPageProps) {
  return (
    <Box width="100%">
      <CRUDHeader
        title={title}
        subtitle={subtitle}
      />

      <Paper
        sx={{
          p: 3,
          borderRadius: 5,

          background:
            "rgba(255,255,255,.82)",

          backdropFilter: "blur(18px)",

          boxShadow:
            "0 20px 50px rgba(15,23,42,.08)",
        }}
      >
        <CRUDToolbar
          search={search}
          addLabel={addLabel}
          placeholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          onAdd={onAdd}
        />

        {children}
      </Paper>
    </Box>
  );
}