import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccountTreeRounded,
  AddRounded,
  CheckCircleRounded,
  FolderRounded,
  InsertDriveFileRounded,
  PictureAsPdfRounded,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";
import { useWorkspace } from "../../../context/WorkspaceContext";

import {
  approveProjectBaseline,
  createProjectBaseline,
  exportPmsPdf,
  getPmsWbs,
  getPmsActivities,
  getProjectBaselines,
  type ProjectBaseline,
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
              `1px solid ${theme.palette.divider}`,
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

  const [exportingPdf, setExportingPdf] = useState(false);
  const [baselines, setBaselines] = useState<ProjectBaseline[]>([]);
  const [baselineLoading, setBaselineLoading] = useState(false);
  const [baselineDialogOpen, setBaselineDialogOpen] = useState(false);
  const [baselineName, setBaselineName] = useState("");
  const [baselineDescription, setBaselineDescription] = useState("");
  const [baselineSaving, setBaselineSaving] = useState(false);
  const [approvingBaselineId, setApprovingBaselineId] = useState<string | null>(null);
  const [wbsRefreshToken, setWbsRefreshToken] = useState(0);

  const activeBaseline = baselines.find(
    baseline => baseline.isApproved && baseline.isActive
  );
  const draftBaselines = baselines.filter(
    baseline => !baseline.isApproved
  );
  const previousBaselines = baselines.filter(
    baseline => baseline.isApproved && !baseline.isActive
  );

  const refreshBaselines = async (projectId: string) => {
    setBaselineLoading(true);
    try {
      setBaselines(await getProjectBaselines(projectId));
    } finally {
      setBaselineLoading(false);
    }
  };

  const handleCreateBaseline = async () => {
    const projectId = workspace.project.id;
    const name = baselineName.trim();
    if (!projectId || !name || baselineSaving) return;

    try {
      setBaselineSaving(true);
      setError(null);
      await createProjectBaseline(projectId, {
        name,
        description: baselineDescription.trim() || undefined,
      });
      await refreshBaselines(projectId);
      setBaselineName("");
      setBaselineDescription("");
      setBaselineDialogOpen(false);
    } catch (baselineError) {
      console.error("Failed to create schedule baseline", baselineError);
      setError("Unable to create the baseline. Check that all budgeted activities have valid planned dates.");
    } finally {
      setBaselineSaving(false);
    }
  };

  const handleApproveBaseline = async (baselineId: string) => {
    const projectId = workspace.project.id;
    if (!projectId || approvingBaselineId) return;

    try {
      setApprovingBaselineId(baselineId);
      setError(null);
      await approveProjectBaseline(projectId, baselineId);
      await refreshBaselines(projectId);
      setWbsRefreshToken(value => value + 1);
    } catch (baselineError) {
      console.error("Failed to approve schedule baseline", baselineError);
      setError("Unable to approve this baseline. Please review the baseline data and try again.");
    } finally {
      setApprovingBaselineId(null);
    }
  };

  const handleExportPdf = async () => {
    if (!workspace.project.id || exportingPdf) return;

    try {
      setExportingPdf(true);
      setError(null);

      const pdf = await exportPmsPdf(workspace.project.id);
      const url = window.URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = "PCS-PMS-Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (exportError) {
      console.error("Failed to export PMS PDF", exportError);
      setError("Unable to generate the PMS PDF report. Please try again.");
    } finally {
      setExportingPdf(false);
    }
  };


  useEffect(() => {

    let cancelled = false;

    async function loadWbs() {

      if (
        !workspace.project.id
      ) {
        setData([]);
        setBaselines([]);
        setBaselineLoading(false);
        setLoading(false);
        return;
      }

      try {

        setLoading(true);
        setBaselineLoading(true);
        setError(null);

        const [wbsResult, activities, baselineResult] = await Promise.all([
          getPmsWbs(workspace.project.id),
          getPmsActivities(workspace.project.id),
          getProjectBaselines(workspace.project.id),
        ]);

        if (!cancelled) {
          setBaselines(baselineResult);
        }

        const activitiesByWbs = new Map<string, typeof activities>();
        for (const activity of activities) {
          const assigned = activitiesByWbs.get(activity.wbsCode) ?? [];
          assigned.push(activity);
          activitiesByWbs.set(activity.wbsCode, assigned);
        }

        const attachActivities = (nodes: WbsNode[]): WbsNode[] =>
          nodes.map(node => {
            const activityNodes: WbsNode[] = (activitiesByWbs.get(node.id) ?? [])
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
          setBaselineLoading(false);
        }

      }

    }

    loadWbs();

    return () => {
      cancelled = true;
    };

  }, [
    workspace.project.id,
    wbsRefreshToken,
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
          alignItems="center"
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

          <Button
            variant="contained"
            size="medium"
            startIcon={
              exportingPdf
                ? <CircularProgress size={16} color="inherit" />
                : <PictureAsPdfRounded />
            }
            disabled={!workspace.project.id || loading || exportingPdf}
            onClick={handleExportPdf}
          >
            {exportingPdf ? "Generating PDF..." : "Export PDF"}
          </Button>
        </Stack>
      </Stack>


      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2.5,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontSize: 13, fontWeight: 750 }}>
                Schedule Baseline
              </Typography>
              {activeBaseline ? (
                <Chip
                  size="small"
                  color="success"
                  icon={<CheckCircleRounded />}
                  label={`Approved · V${activeBaseline.version}`}
                />
              ) : (
                <Chip
                  size="small"
                  color="warning"
                  label="No approved baseline"
                />
              )}
            </Stack>
            <Typography sx={{ mt: 0.5, fontSize: 11.5, color: theme.palette.text.secondary }}>
              {baselineLoading
                ? "Loading baseline versions..."
                : activeBaseline
                  ? `${activeBaseline.name} · ${activeBaseline.activityCount} activities · Budget ${formatNumber(activeBaseline.totalBudget)}`
                  : "EVM Planned Value remains zero until a schedule baseline is created and approved."}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRounded />}
            disabled={!workspace.project.id || baselineLoading || baselineSaving}
            onClick={() => setBaselineDialogOpen(true)}
          >
            Create Baseline Draft
          </Button>
        </Stack>

        {draftBaselines.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${theme.palette.divider}` }}
          >
            {draftBaselines.map(baseline => (
              <Stack
                key={baseline.id}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1.5,
                  bgcolor: theme.palette.action.hover,
                }}
              >
                <Typography sx={{ fontSize: 11.5, flex: 1 }}>
                  {baseline.name} · V{baseline.version} · {baseline.activityCount} activities · {formatNumber(baseline.totalBudget)}
                  {baseline.plannedStart && baseline.plannedFinish
                    ? ` · ${new Date(baseline.plannedStart).toLocaleDateString()} – ${new Date(baseline.plannedFinish).toLocaleDateString()}`
                    : ""}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!!approvingBaselineId}
                  onClick={() => handleApproveBaseline(baseline.id)}
                >
                  {approvingBaselineId === baseline.id
                    ? <CircularProgress size={15} color="inherit" />
                    : "Approve"}
                </Button>
              </Stack>
            ))}
          </Stack>
        )}

        {previousBaselines.length > 0 && (
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ mt: 1.25, flexWrap: "wrap" }}
          >
            <Typography sx={{ fontSize: 10.5, color: theme.palette.text.disabled }}>
              Previous approved versions:
            </Typography>
            {previousBaselines.map(baseline => (
              <Chip
                key={baseline.id}
                size="small"
                variant="outlined"
                label={`V${baseline.version} · ${baseline.name}`}
              />
            ))}
          </Stack>
        )}
      </Paper>

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
            `1px solid ${theme.palette.divider}`,
          borderRadius: 2.5,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
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
                  color: theme.palette.text.disabled,
                }}
              />

              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 650,
                  color: theme.palette.text.secondary,
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
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    WBS / Activity
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 90,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Type
                  </TableCell>

                  <TableCell
                    sx={{
                      minWidth: 155,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Progress
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 125,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Budget
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 125,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Actual Cost
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      minWidth: 125,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Earned Value
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    CPI
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: 80,
                      bgcolor: theme.palette.background.default,
                      fontSize: 10.5,
                      fontWeight: 750,
                      color: theme.palette.text.secondary,
                      borderBottom:
                        `1px solid ${theme.palette.divider}`,
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
      <Dialog
        open={baselineDialogOpen}
        onClose={() => !baselineSaving && setBaselineDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Schedule Baseline</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              autoFocus
              required
              fullWidth
              label="Baseline name"
              value={baselineName}
              onChange={event => setBaselineName(event.target.value)}
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Description"
              value={baselineDescription}
              onChange={event => setBaselineDescription(event.target.value)}
              inputProps={{ maxLength: 500 }}
            />
            <Alert severity="info">
              The draft snapshots activity dates, budgets, WBS assignments and each calendar's weekly working-day pattern. Public-holiday exceptions are not modeled yet. Approval activates it as the EVM reference.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBaselineDialogOpen(false)}
            disabled={baselineSaving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateBaseline}
            disabled={!baselineName.trim() || baselineSaving}
            startIcon={baselineSaving ? <CircularProgress size={15} color="inherit" /> : <AddRounded />}
          >
            Create Draft
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}