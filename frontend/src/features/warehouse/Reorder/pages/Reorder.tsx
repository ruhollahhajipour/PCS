import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

import PageHeader from "../../../../components/Common/PageHeader";

import { useReorder } from "../../Stock/hooks/useReorder";

import ReorderPriorityChip
  from "../../Stock/components/ReorderPriorityChip";

export default function ReorderPage() {

  const {

    items,

    loading,

    error

  } = useReorder();

  if (loading) {

    return (

      <Typography>

        Loading...

      </Typography>

    );

  }

  if (error) {

    return (

      <Typography color="error">

        {error}

      </Typography>

    );

  }

  return (

    <Box>

      <PageHeader

        title="Reorder List"

        subtitle="Materials below reorder point"

      />

      <TableContainer

        component={Paper}

        sx={{

          mt: 4,

          borderRadius: 3

        }}

      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>

                Item Code

              </TableCell>

              <TableCell>

                Item Name

              </TableCell>

              <TableCell>

                Warehouse

              </TableCell>

              <TableCell>

                Current

              </TableCell>

              <TableCell>

                Reorder

              </TableCell>

              <TableCell>

                Safety

              </TableCell>

              <TableCell>

                Suggested

              </TableCell>

              <TableCell>

                Priority

              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {items.map(item => (

              <TableRow

                key={item.itemCode}

              >

                <TableCell>

                  {item.itemCode}

                </TableCell>

                <TableCell>

                  {item.itemName}

                </TableCell>

                <TableCell>

                  {item.warehouse}

                </TableCell>

                <TableCell>

                  {item.currentQty}

                </TableCell>

                <TableCell>

                  {item.reorderPoint}

                </TableCell>

                <TableCell>

                  {item.safetyStock}

                </TableCell>

                <TableCell>

                  {item.suggestedOrderQty}

                </TableCell>

                <TableCell>

                  <ReorderPriorityChip

                    priority={item.priority}

                  />

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </TableContainer>

    </Box>

  );

}