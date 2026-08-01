import { useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import PCSDataGrid from "../../../components/Common/PCSDataGrid/PCSDataGrid";
import StatusChip from "../../../components/Common/StatusChip";

import ProcurementToolbar from "../components/ProcurementToolbar";
import ProcurementKPIs from "../components/ProcurementKPIs";

import ProcurementDialog from "../dialogs/ProcurementDialog";

import useProcurement from "../hooks/useProcurement";

import type {
  Procurement as ProcurementModel
} from "../types/procurement";


export default function Procurement() {


  const {
    items,
    loading,
    create,
    update,
  } = useProcurement();



  const [open, setOpen] =
    useState(false);



  const [selected, setSelected] =
    useState<ProcurementModel | null>(null);



  const [search, setSearch] =
    useState("");




  const rows = useMemo(() => {


    const q =
      search.toLowerCase();



    return items.filter((x) =>

      x.prNo.toLowerCase().includes(q) ||

      x.poNo.toLowerCase().includes(q) ||

      x.project.toLowerCase().includes(q) ||

      x.vendor.toLowerCase().includes(q)

    );


  }, [items, search]);





  const totalPR =
    rows.length;



  const totalPO =
    rows.filter(
      x => x.poNo !== ""
    ).length;



  const totalValue =
    rows.reduce(
      (sum, item) =>
        sum + item.totalPrice,
      0
    );



  const delivered =
    Math.round(

      rows.reduce(
        (sum, item) =>
          sum + item.progress,
        0
      )

      /

      Math.max(rows.length, 1)

    );






  async function handleSave(
    item: ProcurementModel
  ) {


    if (selected) {

      await update(item);

    }

    else {

      await create(item);

    }


    setSelected(null);

    setOpen(false);

  }






  return (

    <Box>


      <Typography

        variant="h4"

        fontWeight={800}

        mb={3}

      >
        Procurement
      </Typography>




      <ProcurementToolbar


        search={search}


        onSearch={setSearch}


        onNew={() => {

          setSelected(null);

          setOpen(true);

        }}



        onRefresh={() =>
          window.location.reload()
        }


      />






      <ProcurementKPIs


        totalPR={totalPR}


        totalPO={totalPO}


        totalValue={totalValue}


        delivered={delivered}


      />







      <Paper

        sx={{

          borderRadius: 5,

          overflow: "hidden",

        }}

      >


        <PCSDataGrid


          rows={rows}


          loading={loading}


          columns={[


            {

              field: "prNo",

              headerName: "PR",

              flex: 1,

            },



            {

              field: "poNo",

              headerName: "PO",

              flex: 1,

            },



            {

              field: "project",

              headerName: "Project",

              flex: 2,

            },



            {

              field: "vendor",

              headerName: "Vendor",

              flex: 2,

            },



            {

              field: "discipline",

              headerName: "Discipline",

              flex: 1.2,

            },



            {

              field: "buyer",

              headerName: "Buyer",

              flex: 1.2,

            },



            {

              field: "quantity",

              headerName: "Qty",

              flex: 0.8,

            },



            {

              field: "unit",

              headerName: "Unit",

              flex: 0.8,

            },



            {

              field: "unitPrice",

              headerName: "Unit Price",

              flex: 1.2,

              valueFormatter: (params: any) =>

                `$${Number(params.value).toLocaleString()}`,

            },



            {

              field: "totalPrice",

              headerName: "Total",

              flex: 1.3,

              valueFormatter: (params: any) =>

                `$${Number(params.value).toLocaleString()}`,

            },



            {

              field: "currency",

              headerName: "Curr.",

              flex: 0.8,

            },



            {

              field: "requestedDate",

              headerName: "Requested",

              flex: 1.2,

            },



            {

              field: "requiredDate",

              headerName: "Required",

              flex: 1.2,

            },



            {

              field: "deliveryDate",

              headerName: "Delivery",

              flex: 1.2,

            },



            {

              field: "progress",

              headerName: "Progress",

              flex: 0.9,

              renderCell: (params: any) => (

                <Typography fontWeight={700}>

                  {params.value}%

                </Typography>

              ),

            },



            {

              field: "status",

              headerName: "Status",

              flex: 1,

              renderCell: (params: any) => (

                <StatusChip

                  value={params.value}

                />

              ),

            },



            {

              field: "updatedAt",

              headerName: "Updated",

              flex: 1.2,

            },


          ]}


        />


      </Paper>






      <ProcurementDialog


        open={open}


        procurement={selected}


        onClose={() => {

          setOpen(false);

          setSelected(null);

        }}



        onSave={handleSave}


      />



    </Box>

  );

}