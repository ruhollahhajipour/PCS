import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  AccountTreeRounded,
  FolderRounded,
  InsertDriveFileRounded,
} from "@mui/icons-material";

import { useWorkspace } from "../../../context/WorkspaceContext";

import {
  getPmsWbs,
  type WbsNode,
} from "../../pms/api/pmsApi";


// =====================================================
// HELPERS
// =====================================================

function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}


function formatPercent(
  value: number
): string {
  return `${value.toFixed(1)}%`;
}


// =====================================================
// TREE ROW
// =====================================================

interface WbsRowProps {
  node: WbsNode;
  depth: number;
}


function WbsRow({
  node,
  depth,
}: WbsRowProps) {

  const [expanded, setExpanded] =
    useState(true);

  const hasChildren =
    node.children &&
    node.children.length > 0;

  return (
    <>
      <TableRow
        hover
        sx={{
          "& > td": {
            borderBottom:
              "1px solid #EEF2F7",
          },
        }}
      >
        {/* WBS */}
        <TableCell
          sx={{
            minWidth: 300,
            py: 1.15,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{
              pl: depth * 2.5,
            }}
          >
            <Box
              onClick={() => {
                if (hasChildren) {
                  setExpanded(
                    value => !value
                  );
                }
              }}
              sx={{
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: hasChildren
                  ? "pointer"
                  : "default",
                borderRadius: 1,
                "&:hover": {
                  bgcolor:
                    hasChildren
                      ? "#F1F5F9"
                      : "transparent",
                },
              }}
            >
              {hasChildren ? (
                <Typography
                  component="span"
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#64748B",
                    transform:
                      expanded
                        ? "rotate(90deg)"
                        : "none",
                    transition:
                      "transform .15s ease",
                  }}
                >
                  ›
                </Typography>
              ) : null}
            </Box>

            {node.isActivity ? (
              <InsertDriveFileRounded
                sx={{
                  fontSize: 17,
                  color: "#64748B",
                }}
              />
            ) : (
              <FolderRounded
                sx={{
                  fontSize: 18,
                  color: "#2563EB",
                }}
              />
            )}

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight:
                    node.isActivity
                      ? 500
                      : 650,
                  color:
                    node.isActivity
                      ? "#334155"
                      : "#0F172A",
                  whiteSpace:
                    "nowrap",
                  overflow:
                    "hidden",
                  textOverflow:
                    "ellipsis",
                }}
              >
                {node.name}
              </Typography>

              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "#94A3B8",
                  mt: 0.15,
                }}
              >
                {node.code}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        {/* TYPE */}
        <TableCell
          align="center"
          sx={{
            minWidth: 90,
            fontSize: 11.5,
            color: "#64748B",
          }}
        >
          {node.isActivity
            ? "Activity"
            : "WBS"}
        </TableCell>

        {/* PROGRESS */}
        <TableCell
          sx={{
            minWidth: 155,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 70,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={Math.max(
                  0,
                  Math.min(
                    100,
                    node.progress
                  )
                )}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "#E8EEF5",
                  "& .MuiLinearProgress-bar":
                    {
                      borderRadius: 3,
                    },
                }}
              />
            </Box>

            <Typography
              sx={{
                minWidth: 42,
                textAlign: "right",
                fontSize: 11.5,
                fontWeight: 650,
                color: "#334155",
              }}
            >
              {formatPercent(
                node.progress
              )}
            </Typography>
          </Stack>
        </TableCell>

        {/* BUDGET */}
        <TableCell
          align="right"
          sx={{
            minWidth: 125,
            fontSize: 11.5,
            color: "#334155",
          }}
        >
          {formatNumber(
            node.budget
          )}
        </TableCell>

        {/* ACTUAL */}
        <TableCell
          align="right"
          sx={{
            minWidth: 125,
            fontSize: 11.5,
            color: "#334155",
          }}
        >
          {formatNumber(
            node.actualCost
          )}
        </TableCell>

        {/* EV */}
        <TableCell
          align="right"
          sx={{
            minWidth: 125,
            fontSize: 11.5,
            color: "#334155",
          }}
        >
          {formatNumber(
            node.earnedValue
          )}
        </TableCell>

        {/* CPI */}
        <TableCell
          align="center"
          sx={{
            minWidth: 80,
            fontSize: 11.5,
            fontWeight: 650,
            color:
              node.cpi > 1
                ? "#15803D"
                : node.cpi > 0
                  ? "#B45309"
                  : "#94A3B8",
          }}
        >
          {node.cpi
            ? node.cpi.toFixed(2)
            : "—"}
        </TableCell>

        {/* SPI */}
        <TableCell
          align="center"
          sx={{
            minWidth: 80,
            fontSize: 11.5,
            fontWeight: 650,
            color:
              node.spi > 1
                ? "#15803D"
                : node.spi > 0
                  ? "#B45309"
                  : "#94A3B8",
          }}
        >
          {node.spi
            ? node.spi.toFixed(2)
            : "—"}
        </TableCell>
      </TableRow>

      {hasChildren &&
        expanded &&
        node.children.map(
          child => (
            <WbsRow
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          )
        )}
    </>
  );
}


// =====================================================
// PAGE
// =====================================================

export default function ProjectWbs() {

  const {
    workspace,
  } = useWorkspace();

  const [
    data,
    setData,
  ] = useState<WbsNode[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  useEffect(() => {

    let cancelled = false;

    async function loadWbs() {

      if (
        !workspace.project.id
      ) {
        setData([]);
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        setError(null);

        const result =
          await getPmsWbs(
            workspace.project.id
          );

        if (!cancelled) {
          setData(result);
        }

      }
      catch (err) {

        console.error(
          "Failed to load project WBS",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load WBS data for the selected project."
          );
        }

      }
      finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }

    loadWbs();

    return () => {
      cancelled = true;
    };

  }, [
    workspace.project.id,
  ]);


  const totals =
    useMemo(() => {

      const allNodes: WbsNode[] = [];

      function flatten(
        nodes: WbsNode[]
      ) {
        nodes.forEach(
          node => {
            allNodes.push(node);

            if (
              node.children?.length
            ) {
              flatten(
                node.children
              );
            }
          }
        );
      }

      flatten(data);

      const budget =
        allNodes.reduce(
          (sum, node) =>
            sum + node.budget,
          0
        );

      const actualCost =
        allNodes.reduce(
          (sum, node) =>
            sum + node.actualCost,
          0
        );

      const earnedValue =
        allNodes.reduce(
          (sum, node) =>
            sum + node.earnedValue,
          0
        );

      const activities =
        allNodes.filter(
          node =>
            node.isActivity
        ).length;

      return {
        budget,
        actualCost,
        earnedValue,
        activities,
      };

    }, [data]);


  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        bgcolor: "#F6F8FB",
        p: {
          xs: 1.5,
          md: 2.5,
        },
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        spacing={2}
        sx={{
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#EAF1FF",
            }}
          >
            <AccountTreeRounded
              sx={{
                fontSize: 22,
                color: "#2563EB",
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 750,
                color: "#0F172A",
                lineHeight: 1.25,
              }}
            >
              Work Breakdown Structure
            </Typography>

            <Typography
              sx={{
                fontSize: 11.5,
                color: "#64748B",
                mt: 0.35,
              }}
            >
              {workspace.project.name}
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={2.5}
          sx={{
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#94A3B8",
              }}
            >
              Activities
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              {totals.activities}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#94A3B8",
              }}
            >
              Budget
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              {formatNumber(
                totals.budget
              )}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#94A3B8",
              }}
            >
              Actual Cost
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              {formatNumber(
                totals.actualCost
              )}
            </Typography>
          </Box>
        </Stack>
      </Stack>


      {/* =================================================
          CONTENT
      ================================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}


      <Paper
        elevation={0}
        sx={{
          border:
            "1px solid #E2E8F0",
          borderRadius: 2.5,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
        }}
      >
        {loading ? (
          <Box
            sx={{
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              alignItems="center"
              spacing={1.5}
            >
              <CircularProgress
                size={28}
                thickness={3}
              />

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#64748B",
                }}
              >
                Loading WBS...
              </Typography>
            </Stack>
          </Box>
        ) : data.length === 0 ? (
          <Box
            sx={{
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
            }}
          >
            <Stack
              alignItems="center"
              spacing={1}
            >
              <AccountTreeRounded
                sx={{
                  fontSize: 42,
                  color: "#CBD5E1",
                }}
              />

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 650,
                  color: "#475569",
                }}
              >
                No WBS data available
              </Typography>

              <Typography
                sx={{
                  fontSize: 11.5,
                  color: "#94A3B8",
                }}
              >
                The selected project does not
                contain a WBS structure yet.
              </Typography>
            </Stack>
          </Box>
        ) : (
          <TableContainer
            sx={{
              maxHeight:
                "calc(100vh - 230px)",
            }}
          >
            <Table
              stickyHeader
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      minWidth: 300,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    WBS / Activity
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 90,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    Type
                  </TableCell>

                  <TableCell
                    sx={{
                      minWidth: 155,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    Progress
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 125,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    Budget
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 125,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    Actual Cost
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 125,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    Earned Value
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    CPI
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      bgcolor: "#F8FAFC",
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: "#64748B",
                      borderBottom:
                        "1px solid #E2E8F0",
                    }}
                  >
                    SPI
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map(
                  node => (
                    <WbsRow
                      key={node.id}
                      node={node}
                      depth={0}
                    />
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}