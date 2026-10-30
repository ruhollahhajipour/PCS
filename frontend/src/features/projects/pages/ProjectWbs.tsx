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

import { useTheme } from "@mui/material/styles";
import { useWorkspace } from "../../../context/WorkspaceContext";

import {
  getPmsWbs,
  getPmsActivities,
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

  const theme = useTheme();
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
                      ? theme.palette.action.hover
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
                    color: theme.palette.text.secondary,
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
                  color: theme.palette.text.secondary,
                }}
              />
            ) : (
              <FolderRounded
                sx={{
                  fontSize: 18,
                  color: theme.palette.primary.main,
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
                      ? theme.palette.text.primary
                      : theme.palette.text.primary,
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
                  color: theme.palette.text.disabled,
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
            color: theme.palette.text.secondary,
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
                  bgcolor: theme.palette.divider,
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
                color: theme.palette.text.primary,
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
            color: theme.palette.text.primary,
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
            color: theme.palette.text.primary,
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
            color: theme.palette.text.primary,
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
                ? theme.palette.success.main
                : node.cpi > 0
                  ? theme.palette.warning.main
                  : theme.palette.text.disabled,
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
                ? theme.palette.success.main
                : node.spi > 0
                  ? theme.palette.warning.main
                  : theme.palette.text.disabled,
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

  const theme = useTheme();
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

        const [wbsResult, activities] = await Promise.all([
          getPmsWbs(workspace.project.id),
          getPmsActivities(workspace.project.id),
        ]);

        const activitiesByWbs = new Map<string, typeof activities>();
        for (const activity of activities) {
          const assigned = activitiesByWbs.get(activity.wbsCode) ?? [];
          assigned.push(activity);
          activitiesByWbs.set(activity.wbsCode, assigned);
        }

        const attachActivities = (nodes: WbsNode[]): WbsNode[] =>
          nodes.map(node => {
            const activityNodes: WbsNode[] = (activitiesByWbs.get(node.code) ?? [])
              .sort((a, b) => a.code.localeCompare(b.code))
              .map(activity => ({
                id: activity.id,
                parentId: node.id,
                code: activity.code,
                parentCode: node.code,
                path: `${node.path}/${activity.code}`,
                name: activity.name,
                level: node.level + 1,
                sortOrder: 0,
                isActivity: true,
                budget: activity.budget,
                actualCost: activity.actualCost,
                plannedValue: activity.plannedValue,
                earnedValue: activity.earnedValue,
                weightFactor: node.budget > 0
                  ? activity.budget / node.budget * 100
                  : 0,
                weightValue: activity.weightValue,
                weight: activity.weight,
                progress: activity.progress,
                cpi: activity.actualCost > 0
                  ? activity.earnedValue / activity.actualCost
                  : 0,
                spi: activity.plannedValue > 0
                  ? activity.earnedValue / activity.plannedValue
                  : 0,
                children: [],
              }));

            return {
              ...node,
              children: [
                ...activityNodes,
                ...attachActivities(node.children ?? []),
              ],
            };
          });

        if (!cancelled) {
          setData(attachActivities(wbsResult));
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

      // WBS parent rows already contain bottom-up rollups.
      // Sum only project roots to avoid counting descendants twice.
      const budget = data.reduce(
        (sum, node) => sum + node.budget,
        0
      );

      const actualCost = data.reduce(
        (sum, node) => sum + node.actualCost,
        0
      );

      const earnedValue = data.reduce(
        (sum, node) => sum + node.earnedValue,
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
        bgcolor: theme.palette.background.default,
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
              bgcolor: theme.palette.action.selected,
            }}
          >
            <AccountTreeRounded
              sx={{
                fontSize: 22,
                color: theme.palette.primary.main,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 750,
                color: theme.palette.text.primary,
                lineHeight: 1.25,
              }}
            >
              Work Breakdown Structure
            </Typography>

            <Typography
              sx={{
                fontSize: 11.5,
                color: theme.palette.text.secondary,
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
                color: theme.palette.text.disabled,
              }}
            >
              Activities
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {totals.activities}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 10.5,
                color: theme.palette.text.disabled,
              }}
            >
              Budget
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.palette.text.primary,
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
                color: theme.palette.text.disabled,
              }}
            >
              Actual Cost
            </Typography>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.palette.text.primary,
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
                  color: theme.palette.text.secondary,
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
                  color: theme.palette.text.disabled,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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
                      color: theme.palette.text.secondary,
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