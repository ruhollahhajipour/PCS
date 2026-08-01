import { useState } from "react";

import {
  Box,
  Paper,
} from "@mui/material";

import PCSDataGrid from "../../../../components/Common/PCSDataGrid/PCSDataGrid";

import useIssue from "../hooks/useIssue";

import IssueDialog from "../dialogs/IssueDialog";

import IssueToolbar from "../components/IssueToolbar";

import IssueKPIs from "../components/IssueKPIs";

import type { Issue } from "../types/issue";

export default function Issue() {

  const {
    items,
    loading,
    create,
    update,
    remove,
  } = useIssue();

  const [open, setOpen] =
    useState(false);

  const [selected, setSelected] =
    useState<Issue | null>(null);

  async function handleSave(
    item: Issue
  ) {

    if (selected)
      await update(item);
    else
      await create(item);

  }

  async function handleDelete(
    id: number
  ) {

    if (
      window.confirm(
        "Delete this Issue?"
      )
    ) {

      await remove(id);

    }

  }

  return (

    <Box>

      <IssueKPIs
        items={items}
      />

      <IssueToolbar
        onNew={() => {

          setSelected(null);

          setOpen(true);

        }}
      />

      <Paper
        sx={{
          mt: 2,
        }}
      >

        <PCSDataGrid
          loading={loading}
          rows={items}
          columns={[

            {
              field: "issueNo",
              headerName: "Issue No",
              flex: 1,
            },

            {
              field: "warehouse",
              headerName: "Warehouse",
              flex: 1,
            },

            {
              field: "project",
              headerName: "Project",
              flex: 1,
            },

            {
              field: "itemCode",
              headerName: "Item Code",
              flex: 1,
            },

            {
              field: "itemName",
              headerName: "Item Name",
              flex: 2,
            },

            {
              field: "quantity",
              headerName: "Qty",
              flex: 1,
            },

            {
              field: "unit",
              headerName: "Unit",
              flex: 1,
            },

            {
              field: "status",
              headerName: "Status",
              flex: 1,
            },

            {
              field: "actions",
              headerName: "Actions",
              flex: 1,

              sortable: false,

              renderCell: (params: any) => (

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >

                  <button
                    onClick={() => {

                      setSelected(params.row);

                      setOpen(true);

                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        params.row.id
                      )
                    }
                  >
                    Delete
                  </button>

                </Box>

              ),

            },

          ]}
        />

      </Paper>

      <IssueDialog
        open={open}
        issue={selected}
        onClose={() => {

          setOpen(false);

          setSelected(null);

        }}
        onSave={handleSave}
      />

    </Box>

  );

}