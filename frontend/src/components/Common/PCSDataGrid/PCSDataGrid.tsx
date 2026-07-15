import {
  DataGrid,
} from "@mui/x-data-grid";

import type {
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";

interface PCSDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  height?: number | string;
}

export default function PCSDataGrid({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  height = 600,
}: PCSDataGridProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        height,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize,
            },
          },
        }}
        disableRowSelectionOnClick
        density="compact"
        sx={{
          border: 0,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },

          "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
        }}
      />
    </Paper>
  );
}