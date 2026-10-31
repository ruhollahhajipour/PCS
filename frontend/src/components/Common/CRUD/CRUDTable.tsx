import { DataGrid } from "@mui/x-data-grid";

import type {
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";

type Props = {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
};

export default function CRUDTable({
  rows,
  columns,
  loading = false,
  pageSize = 10,
}: Props) {
  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      loading={loading}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 20, 50, 100]}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize,
          },
        },
      }}
      sx={{
        border: 0,

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#F8FAFC",
          fontWeight: 700,
          fontSize: 14,
        },

        "& .MuiDataGrid-cell": {
          borderBottom: "1px solid #F1F5F9",
        },

        "& .MuiDataGrid-row:hover": {
          backgroundColor: "#EEF4FB",
        },

        "& .MuiDataGrid-footerContainer": {
          borderTop: "1px solid #E5E7EB",
        },

        "& .MuiDataGrid-columnSeparator": {
          display: "none",
        },
      }}
    />
  );
}