import { useState } from "react";

import {
  Box,
  Paper,
  Button,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import PCSDataGrid from "../../../components/Common/PCSDataGrid/PCSDataGrid";

import StatusChip from "../../../components/Common/StatusChip/StatusChip";

import CompanyDialog from "../dialogs/CompanyDialog";
import CompanyActions from "../components/CompanyActions";

import useCompanies from "../hooks/useCompanies";

import type { Company } from "../types/company";

export default function Companies() {

  const {

    companies,

    loading,

    create,

    update,

    remove,

  } = useCompanies();

  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState<Company | null>(null);

  function handleNew() {

    setEditing(null);

    setOpen(true);

  }

  function handleEdit(
    company: Company
  ) {

    setEditing(company);

    setOpen(true);

  }

  async function handleDelete(
    id: number
  ) {

    if (
      window.confirm(
        "Delete this company?"
      )
    ) {

      await remove(id);

    }

  }

  async function handleSave(
    company: Company
  ) {

    if (editing) {

      await update(company);

    }

    else {

      await create(company);

    }

  }

  return (

    <Box>

      <Box

        display="flex"

        justifyContent="space-between"

        alignItems="center"

        mb={3}

      >

        <Typography

          variant="h4"

          fontWeight={700}

        >

          Companies

        </Typography>

        <Button

          variant="contained"

          startIcon={<AddIcon />}

          onClick={handleNew}

        >

          New Company

        </Button>

      </Box>

      <Paper

        sx={{

          borderRadius:4,

          overflow:"hidden",

        }}

      >

        <PCSDataGrid

          rows={companies}

          loading={loading}

          columns={[

            {

              field:"code",

              headerName:"Code",

              flex:1,

            },

            {

              field:"name",

              headerName:"Company",

              flex:2,

            },

            {

              field:"country",

              headerName:"Country",

              flex:1,

            },

            {

              field:"city",

              headerName:"City",

              flex:1,

            },

            {

              field:"phone",

              headerName:"Phone",

              flex:1.4,

            },

            {

              field:"status",

              headerName:"Status",

              flex:1,

              renderCell:(params:any)=>(

                <StatusChip

                  value={params.value}

                />

              ),

            },

            {

              field:"actions",

              headerName:"",

              width:120,

              sortable:false,

              filterable:false,

              renderCell:(params:any)=>(

                <CompanyActions

                  company={params.row}

                  onEdit={handleEdit}

                  onDelete={handleDelete}

                />

              ),

            },

          ]}

        />

      </Paper>

      <CompanyDialog

        open={open}

        company={editing}

        onClose={()=>setOpen(false)}

        onSave={handleSave}

      />

    </Box>

  );

}