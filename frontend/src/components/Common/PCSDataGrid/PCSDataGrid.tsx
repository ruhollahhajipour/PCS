import {
  DataGrid,
  GridToolbar,
  type GridColDef,
} from "@mui/x-data-grid";

type Props = {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
};

export default function PCSDataGrid({
  rows,
  columns,
  loading = false,
}: Props) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[10, 20, 50, 100]}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      slots={{
        toolbar: GridToolbar,
      }}
      sx={{
        border: 0,

        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#F8FAFC",
          fontWeight: 700,
          fontSize: 15,
        },

        "& .MuiDataGrid-cell": {
          borderBottom: "1px solid #EEF2F7",
        },

        "& .MuiDataGrid-row:hover": {
          backgroundColor: "#EEF6FF",
        },

        "& .MuiDataGrid-toolbarContainer": {
          padding: 2,
          borderBottom: "1px solid #EEF2F7",
        },

        "& .MuiDataGrid-footerContainer": {
          backgroundColor: "#FAFBFD",
        },
      }}
    />
  );
}