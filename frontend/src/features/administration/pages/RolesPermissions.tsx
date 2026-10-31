import {
  Box,
  Card,
    Chip,
  Divider,
    Grid,
  IconButton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  AdminPanelSettingsRounded,
  CheckCircleRounded,
    EditRounded,
  GroupsRounded,
  LockRounded,
  MoreVertRounded,
  SearchRounded,
  SecurityRounded,
  ShieldRounded,
  VisibilityRounded,
} from "@mui/icons-material";

import { useMemo, useState } from "react";


type Permission = {
  id: string;
  label: string;
  description: string;
};


type PermissionGroup = {
  title: string;
  description: string;
  permissions: Permission[];
};


type Role = {
  id: string;
  name: string;
  description: string;
  users: number;
  system: boolean;
  color: string;
};


const roles: Role[] = [
  {
    id: "administrator",
    name: "Administrator",
    description:
      "Full access to PCS administration and system functions.",
    users: 2,
    system: true,
    color: "#2563EB",
  },
  {
    id: "project-manager",
    name: "Project Manager",
    description:
      "Manage projects, planning, progress and project controls.",
    users: 4,
    system: false,
    color: "#4F46E5",
  },
  {
    id: "cost-controller",
    name: "Cost Controller",
    description:
      "Manage budgets, commitments, actual costs and EVM.",
    users: 3,
    system: false,
    color: "#0891B2",
  },
  {
    id: "procurement",
    name: "Procurement",
    description:
      "Manage procurement activities, vendors and expediting.",
    users: 5,
    system: false,
    color: "#059669",
  },
  {
    id: "viewer",
    name: "Viewer",
    description:
      "Read-only access to authorized project information.",
    users: 6,
    system: false,
    color: "#64748B",
  },
];


const permissionGroups: PermissionGroup[] = [
  {
    title: "Project Management",
    description:
      "Project structure, planning and project control functions.",
    permissions: [
      {
        id: "projects.view",
        label: "View Projects",
        description: "View project information and status.",
      },
      {
        id: "projects.create",
        label: "Create Projects",
        description: "Create new projects in PCS.",
      },
      {
        id: "projects.edit",
        label: "Edit Projects",
        description: "Modify project information.",
      },
      {
        id: "projects.delete",
        label: "Delete Projects",
        description: "Remove projects from the system.",
      },
      {
        id: "projects.progress",
        label: "Manage Progress",
        description: "Update and review project progress.",
      },
    ],
  },

  {
    title: "Cost & Commercial",
    description:
      "Financial control, budget and earned value management.",
    permissions: [
      {
        id: "cost.view",
        label: "View Cost",
        description: "View cost information.",
      },
      {
        id: "cost.budget",
        label: "Manage Budget",
        description: "Create and maintain project budgets.",
      },
      {
        id: "cost.commitments",
        label: "Manage Commitments",
        description: "Manage purchase and contract commitments.",
      },
      {
        id: "cost.actual",
        label: "Manage Actual Cost",
        description: "Manage actual project costs.",
      },
      {
        id: "cost.evm",
        label: "EVM",
        description: "Access earned value management information.",
      },
    ],
  },

  {
    title: "Procurement & Materials",
    description:
      "Procurement, material control and vendor management.",
    permissions: [
      {
        id: "procurement.view",
        label: "View Procurement",
        description: "View procurement information.",
      },
      {
        id: "procurement.manage",
        label: "Manage Procurement",
        description: "Create and update procurement activities.",
      },
      {
        id: "vendors.manage",
        label: "Manage Vendors",
        description: "Manage vendor information.",
      },
      {
        id: "materials.manage",
        label: "Manage Materials",
        description: "Manage material control information.",
      },
    ],
  },

  {
    title: "Warehouse & Logistics",
    description:
      "Inventory, receiving, issue and material movement.",
    permissions: [
      {
        id: "warehouse.view",
        label: "View Warehouse",
        description: "View warehouse and inventory information.",
      },
      {
        id: "warehouse.receiving",
        label: "Receiving",
        description: "Receive materials into inventory.",
      },
      {
        id: "warehouse.issue",
        label: "Issue Material",
        description: "Issue materials from inventory.",
      },
      {
        id: "warehouse.transfer",
        label: "Transfer",
        description: "Transfer materials between locations.",
      },
    ],
  },

  {
    title: "Administration",
    description:
      "System administration and security management.",
    permissions: [
      {
        id: "users.manage",
        label: "Manage Users",
        description: "Create and manage user accounts.",
      },
      {
        id: "roles.manage",
        label: "Manage Roles",
        description: "Create and modify user roles.",
      },
      {
        id: "permissions.manage",
        label: "Manage Permissions",
        description: "Configure access permissions.",
      },
      {
        id: "audit.view",
        label: "View Audit Log",
        description: "Review system activity history.",
      },
      {
        id: "system.configure",
        label: "System Configuration",
        description: "Manage global PCS configuration.",
      },
    ],
  },
];


export default function RolesPermissions() {
  const [selectedRole, setSelectedRole] =
    useState("administrator");

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState(0);

  const [permissions, setPermissions] =
    useState<Record<string, boolean>>({});


  const currentRole = roles.find(
    (role) => role.id === selectedRole
  );


  const filteredGroups = useMemo(() => {
    if (!search.trim()) {
      return permissionGroups;
    }

    const value = search.toLowerCase();

    return permissionGroups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(
          (permission) =>
            permission.label
              .toLowerCase()
              .includes(value) ||
            permission.description
              .toLowerCase()
              .includes(value)
        ),
      }))
      .filter(
        (group) => group.permissions.length > 0
      );
  }, [search]);


  const isPermissionEnabled = (
    permissionId: string
  ) => {
    if (
      selectedRole === "administrator"
    ) {
      return true;
    }

    return (
      permissions[
        `${selectedRole}:${permissionId}`
      ] ?? false
    );
  };


  const togglePermission = (
    permissionId: string
  ) => {
    if (
      selectedRole === "administrator"
    ) {
      return;
    }

    const key =
      `${selectedRole}:${permissionId}`;

    setPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };


  const getGroupState = (
    group: PermissionGroup
  ) => {
    const enabled =
      group.permissions.filter(
        (permission) =>
          isPermissionEnabled(
            permission.id
          )
      ).length;

    return {
      enabled,
      total: group.permissions.length,
      all:
        enabled ===
        group.permissions.length,
    };
  };


  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1550,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 2,
          md: 3,
        },
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3.5 }}
      >

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >

          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              background:
                "linear-gradient(135deg,#4F46E5,#2563EB)",
              boxShadow:
                "0 12px 30px rgba(37,99,235,.22)",
            }}
          >
            <SecurityRounded
              sx={{ fontSize: 29 }}
            />
          </Box>

          <Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  md: 30,
                },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "#0F172A",
              }}
            >
              Roles & Permissions
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                fontSize: 13,
                color: "#64748B",
              }}
            >
              Define roles and control access across PCS
            </Typography>

          </Box>

        </Stack>


        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >

          <Chip
            icon={
              <ShieldRounded
                sx={{ fontSize: 16 }}
              />
            }
            label="Access Control"
            size="small"
            sx={{
              height: 30,
              borderRadius: 1.8,
              bgcolor:
                "rgba(37,99,235,.07)",
              color: "#2563EB",
              border:
                "1px solid rgba(37,99,235,.12)",
              fontSize: 11,
              fontWeight: 700,
              "& .MuiChip-icon": {
                color: "#2563EB",
              },
            }}
          />

        </Box>

      </Stack>


      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <Grid
        container
        spacing={2.5}
      >

        {/* =================================================
            ROLES
        ================================================= */}

        <Grid
          size={{
            xs: 12,
            md: 4,
            lg: 3,
          }}
        >

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border:
                "1px solid #E2E8F0",
              overflow: "hidden",
              height: "100%",
              minHeight: 610,
              boxShadow:
                "0 8px 28px rgba(15,23,42,.045)",
            }}
          >

            <Box
              sx={{
                px: 2.25,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >

              <Box>

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#1E293B",
                  }}
                >
                  Roles
                </Typography>

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: 10.5,
                    color: "#94A3B8",
                  }}
                >
                  {roles.length} roles configured
                </Typography>

              </Box>

              <Tooltip title="Create role">

                <IconButton
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    color: "#2563EB",
                    bgcolor:
                      "rgba(37,99,235,.07)",
                    "&:hover": {
                      bgcolor:
                        "rgba(37,99,235,.13)",
                    },
                  }}
                >
                  <AddRounded fontSize="small" />
                </IconButton>

              </Tooltip>

            </Box>

            <Divider />


            <Box
              sx={{
                p: 1,
              }}
            >

              {roles.map((role) => {

                const active =
                  role.id === selectedRole;

                return (
                  <Box
                    key={role.id}
                    onClick={() =>
                      setSelectedRole(
                        role.id
                      )
                    }
                    sx={{
                      position: "relative",
                      mb: 0.6,
                      px: 1.4,
                      py: 1.25,
                      borderRadius: 2,
                      cursor: "pointer",
                      bgcolor: active
                        ? "rgba(37,99,235,.075)"
                        : "transparent",
                      border: active
                        ? "1px solid rgba(37,99,235,.13)"
                        : "1px solid transparent",
                      transition:
                        "all .18s ease",

                      "&:hover": {
                        bgcolor:
                          active
                            ? "rgba(37,99,235,.09)"
                            : "#F8FAFC",
                      },

                      "&:before": active
                        ? {
                            content: '""',
                            position:
                              "absolute",
                            left: 0,
                            top: 10,
                            bottom: 10,
                            width: 3,
                            borderRadius: 3,
                            bgcolor:
                              role.color,
                          }
                        : {},
                    }}
                  >

                    <Stack
                      direction="row"
                      spacing={1.2}
                      alignItems="center"
                    >

                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1.8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          bgcolor:
                            `${role.color}10`,
                          color:
                            role.color,
                        }}
                      >
                        {role.system ? (
                          <AdminPanelSettingsRounded
                            sx={{
                              fontSize: 19,
                            }}
                          />
                        ) : (
                          <GroupsRounded
                            sx={{
                              fontSize: 19,
                            }}
                          />
                        )}
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.7}
                        >

                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 750,
                              color: "#1E293B",
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {role.name}
                          </Typography>

                          {role.system && (
                            <Chip
                              label="System"
                              size="small"
                              sx={{
                                height: 17,
                                fontSize: 8,
                                fontWeight: 700,
                                bgcolor:
                                  "#EFF6FF",
                                color:
                                  "#2563EB",
                                "& .MuiChip-label":
                                  {
                                    px: 0.65,
                                  },
                              }}
                            />
                          )}

                        </Stack>

                        <Typography
                          sx={{
                            mt: 0.3,
                            fontSize: 9.5,
                            color: "#94A3B8",
                          }}
                        >
                          {role.users} users
                        </Typography>

                      </Box>

                    </Stack>

                  </Box>
                );
              })}

            </Box>

            <Box
              sx={{
                mt: "auto",
                px: 2,
                py: 1.5,
                borderTop:
                  "1px solid #F1F5F9",
                bgcolor: "#FAFBFC",
              }}
            >

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >

                <LockRounded
                  sx={{
                    fontSize: 15,
                    color: "#94A3B8",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 9.5,
                    color: "#94A3B8",
                    lineHeight: 1.5,
                  }}
                >
                  System roles are protected from deletion.
                </Typography>

              </Stack>

            </Box>

          </Card>

        </Grid>


        {/* =================================================
            PERMISSION MATRIX
        ================================================= */}

        <Grid
          size={{
            xs: 12,
            md: 8,
            lg: 9,
          }}
        >

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border:
                "1px solid #E2E8F0",
              boxShadow:
                "0 8px 28px rgba(15,23,42,.045)",
              overflow: "hidden",
            }}
          >

            {/* Role Header */}

            <Box
              sx={{
                px: {
                  xs: 2,
                  md: 2.75,
                },
                py: 2.25,
              }}
            >

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                spacing={2}
              >

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >

                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        `${currentRole?.color ?? "#2563EB"}10`,
                      color:
                        currentRole?.color ??
                        "#2563EB",
                    }}
                  >
                    {currentRole?.system ? (
                      <AdminPanelSettingsRounded />
                    ) : (
                      <GroupsRounded />
                    )}
                  </Box>

                  <Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >

                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: "#1E293B",
                        }}
                      >
                        {currentRole?.name}
                      </Typography>

                      {currentRole?.system && (
                        <Chip
                          label="Protected"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 8.5,
                            fontWeight: 700,
                            bgcolor:
                              "#EFF6FF",
                            color:
                              "#2563EB",
                          }}
                        />
                      )}

                    </Stack>

                    <Typography
                      sx={{
                        mt: 0.35,
                        fontSize: 10.5,
                        color: "#94A3B8",
                      }}
                    >
                      {currentRole?.description}
                    </Typography>

                  </Box>

                </Stack>


                <Stack
                  direction="row"
                  spacing={0.5}
                >

                  <Tooltip title="Edit role">

                    <IconButton
                      size="small"
                      sx={{
                        color: "#64748B",
                        "&:hover": {
                          bgcolor: "#F1F5F9",
                          color: "#2563EB",
                        },
                      }}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>

                  </Tooltip>

                  <Tooltip title="More">

                    <IconButton
                      size="small"
                      sx={{
                        color: "#64748B",
                      }}
                    >
                      <MoreVertRounded fontSize="small" />
                    </IconButton>

                  </Tooltip>

                </Stack>

              </Stack>

            </Box>


            <Divider />


            {/* Tabs */}

            <Tabs
              value={activeTab}
              onChange={(_, value) =>
                setActiveTab(value)
              }
              sx={{
                px: 2,
                minHeight: 44,
                borderBottom:
                  "1px solid #F1F5F9",

                "& .MuiTab-root": {
                  minHeight: 44,
                  fontSize: 11,
                  fontWeight: 650,
                  textTransform: "none",
                },
              }}
            >

              <Tab label="Permissions" />

              <Tab label="Users" />

            </Tabs>


            {activeTab === 0 && (
              <>

                {/* Search */}

                <Box
                  sx={{
                    px: {
                      xs: 2,
                      md: 2.5,
                    },
                    py: 1.5,
                  }}
                >

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search permissions..."
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <SearchRounded
                          sx={{
                            mr: 1,
                            fontSize: 19,
                            color: "#94A3B8",
                          }}
                        />
                      ),
                    }}
                    sx={{
                      maxWidth: 420,
                      "& .MuiOutlinedInput-root":
                        {
                          borderRadius: 2,
                          fontSize: 11.5,
                        },
                    }}
                  />

                </Box>


                {/* Permission Groups */}

                <Box
                  sx={{
                    px: {
                      xs: 1.5,
                      md: 2.5,
                    },
                    pb: 2.5,
                  }}
                >

                  {filteredGroups.map(
                    (group) => {

                      const state =
                        getGroupState(
                          group
                        );

                      return (
                        <Box
                          key={group.title}
                          sx={{
                            mb: 2,
                            border:
                              "1px solid #E2E8F0",
                            borderRadius: 2.5,
                            overflow:
                              "hidden",
                          }}
                        >

                          {/* Group Header */}

                          <Box
                            sx={{
                              px: 1.75,
                              py: 1.35,
                              bgcolor:
                                "#F8FAFC",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "space-between",
                            }}
                          >

                            <Box>

                              <Typography
                                sx={{
                                  fontSize: 11.5,
                                  fontWeight: 800,
                                  color:
                                    "#334155",
                                }}
                              >
                                {group.title}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 0.2,
                                  fontSize: 9.5,
                                  color:
                                    "#94A3B8",
                                }}
                              >
                                {group.description}
                              </Typography>

                            </Box>

                            <Chip
                              label={`${state.enabled}/${state.total}`}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: 9,
                                fontWeight: 700,
                                bgcolor:
                                  state.all
                                    ? "#ECFDF5"
                                    : "#F1F5F9",
                                color:
                                  state.all
                                    ? "#059669"
                                    : "#64748B",
                              }}
                            />

                          </Box>


                          {/* Permissions */}

                          {group.permissions.map(
                            (
                              permission,
                              index
                            ) => {

                              const enabled =
                                isPermissionEnabled(
                                  permission.id
                                );

                              return (
                                <Box
                                  key={
                                    permission.id
                                  }
                                  sx={{
                                    px: 1.75,
                                    py: 1.1,
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "space-between",
                                    borderTop:
                                      index === 0
                                        ? "none"
                                        : "1px solid #F1F5F9",
                                    transition:
                                      "background .15s ease",

                                    "&:hover": {
                                      bgcolor:
                                        "#FAFBFC",
                                    },
                                  }}
                                >

                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >

                                    <Box
                                      sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius:
                                          1.5,
                                        display:
                                          "flex",
                                        alignItems:
                                          "center",
                                        justifyContent:
                                          "center",
                                        bgcolor:
                                          enabled
                                            ? "rgba(37,99,235,.08)"
                                            : "#F8FAFC",
                                        color:
                                          enabled
                                            ? "#2563EB"
                                            : "#94A3B8",
                                      }}
                                    >
                                      <CheckCircleRounded
                                        sx={{
                                          fontSize: 17,
                                        }}
                                      />
                                    </Box>

                                    <Box>

                                      <Typography
                                        sx={{
                                          fontSize: 11.5,
                                          fontWeight: 600,
                                          color:
                                            "#334155",
                                        }}
                                      >
                                        {
                                          permission.label
                                        }
                                      </Typography>

                                      <Typography
                                        sx={{
                                          mt: 0.15,
                                          fontSize: 9.5,
                                          color:
                                            "#94A3B8",
                                        }}
                                      >
                                        {
                                          permission.description
                                        }
                                      </Typography>

                                    </Box>

                                  </Stack>


                                  <Switch
                                    size="small"
                                    checked={
                                      enabled
                                    }
                                    disabled={
                                      currentRole?.system ===
                                      true
                                    }
                                    onChange={() =>
                                      togglePermission(
                                        permission.id
                                      )
                                    }
                                  />

                                </Box>
                              );
                            }
                          )}

                        </Box>
                      );
                    }
                  )}

                  {filteredGroups.length ===
                    0 && (
                    <Box
                      sx={{
                        py: 8,
                        textAlign:
                          "center",
                        color: "#94A3B8",
                      }}
                    >

                      <SearchRounded
                        sx={{
                          fontSize: 36,
                          mb: 1,
                          opacity: 0.45,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 12,
                        }}
                      >
                        No permissions found
                      </Typography>

                    </Box>
                  )}

                </Box>

              </>
            )}


            {activeTab === 1 && (
              <Box
                sx={{
                  minHeight: 430,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  px: 3,
                }}
              >

                <Box>

                  <VisibilityRounded
                    sx={{
                      fontSize: 42,
                      color: "#CBD5E1",
                      mb: 1,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    Assigned Users
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 10.5,
                      color: "#94A3B8",
                    }}
                  >
                    User assignment will be connected
                    to the user management module.
                  </Typography>

                </Box>

              </Box>
            )}

          </Card>

        </Grid>

      </Grid>


      {/* =====================================================
          FOOTER NOTE
      ===================================================== */}

      <Box
        sx={{
          mt: 2.5,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: "#F8FAFC",
          border:
            "1px solid #E2E8F0",
        }}
      >

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >

          <SecurityRounded
            sx={{
              fontSize: 16,
              color: "#64748B",
            }}
          />

          <Typography
            sx={{
              fontSize: 10,
              color: "#64748B",
            }}
          >
            Permissions define what users can view, create,
            modify or administer within PCS. Changes will be
            enforced according to the user's assigned role.
          </Typography>

        </Stack>

      </Box>

    </Box>
  );
}