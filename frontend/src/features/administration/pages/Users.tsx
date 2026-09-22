import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  BlockRounded,
  CheckCircleRounded,
  EditRounded,
  MoreVertRounded,
  PersonSearchRounded,
  RefreshRounded,
  SearchRounded,
  SecurityRounded,
  PeopleRounded,
} from "@mui/icons-material";

import { useMemo, useState } from "react";


type UserStatus = "Active" | "Inactive";

type UserRecord = {
  id: number;
  name: string;
  username: string;
  role: string;
  department: string;
  email: string;
  status: UserStatus;
  lastLogin: string;
  initials: string;
};


const users: UserRecord[] = [
  {
    id: 1,
    name: "Ruhollah Hajipour",
    username: "rhajipour",
    role: "Project Manager",
    department: "Project Controls",
    email: "rhajipour@pcs.local",
    status: "Active",
    lastLogin: "Today, 08:42",
    initials: "RH",
  },
  {
    id: 2,
    name: "Ahmed Rahimi",
    username: "arahimi",
    role: "Cost Controller",
    department: "Cost & Commercial",
    email: "arahimi@pcs.local",
    status: "Active",
    lastLogin: "Today, 07:58",
    initials: "AR",
  },
  {
    id: 3,
    name: "Sara Mohammadi",
    username: "smohammadi",
    role: "Planning Engineer",
    department: "Project Controls",
    email: "smohammadi@pcs.local",
    status: "Active",
    lastLogin: "Yesterday, 16:21",
    initials: "SM",
  },
  {
    id: 4,
    name: "Reza Karimi",
    username: "rkarimi",
    role: "Procurement Engineer",
    department: "Procurement",
    email: "rkarimi@pcs.local",
    status: "Active",
    lastLogin: "Yesterday, 14:05",
    initials: "RK",
  },
  {
    id: 5,
    name: "Nima Ahmadi",
    username: "nahmadi",
    role: "Warehouse Supervisor",
    department: "Warehouse & Logistics",
    email: "nahmadi@pcs.local",
    status: "Inactive",
    lastLogin: "Aug 20, 2026",
    initials: "NA",
  },
];


export default function Users() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) =>
      [
        user.name,
        user.username,
        user.role,
        user.department,
        user.email,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [search]);


  const activeCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveCount = users.filter(
    (user) => user.status === "Inactive"
  ).length;


  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
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
        sx={{
          mb: 3,
        }}
      >

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.8}
        >

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(37,99,235,.09)",
              color: "#2563EB",
              border:
                "1px solid rgba(37,99,235,.12)",
            }}
          >
            <PeopleRounded
              sx={{
                fontSize: 28,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  md: 29,
                },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "#0F172A",
              }}
            >
              Users
            </Typography>

            <Typography
              sx={{
                mt: 0.55,
                fontSize: 12.5,
                color: "#64748B",
              }}
            >
              Manage user accounts and system access
            </Typography>
          </Box>

        </Stack>


        <Button
          variant="contained"
          startIcon={<AddRounded />}
          sx={{
            minHeight: 40,
            px: 2,
            borderRadius: 2,
            textTransform: "none",
            fontSize: 12,
            fontWeight: 700,
            boxShadow:
              "0 7px 18px rgba(37,99,235,.20)",
          }}
        >
          Add User
        </Button>

      </Stack>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={1.5}
        sx={{
          mb: 2.5,
        }}
      >

        <Card
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2.5,
            border:
              "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              p: 2,
              "&:last-child": {
                pb: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              Total Users
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: 23,
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              {users.length}
            </Typography>
          </CardContent>
        </Card>


        <Card
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2.5,
            border:
              "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              p: 2,
              "&:last-child": {
                pb: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              Active Users
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: 23,
                fontWeight: 800,
                color: "#059669",
              }}
            >
              {activeCount}
            </Typography>
          </CardContent>
        </Card>


        <Card
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2.5,
            border:
              "1px solid #E2E8F0",
          }}
        >
          <CardContent
            sx={{
              p: 2,
              "&:last-child": {
                pb: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              Inactive Users
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                fontSize: 23,
                fontWeight: 800,
                color: "#DC2626",
              }}
            >
              {inactiveCount}
            </Typography>
          </CardContent>
        </Card>

      </Stack>


      {/* =====================================================
          USERS CARD
      ===================================================== */}

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border:
            "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow:
            "0 8px 28px rgba(15,23,42,.045)",
        }}
      >

        {/* Toolbar */}

        <Box
          sx={{
            px: {
              xs: 2,
              md: 2.5,
            },
            py: 1.8,
          }}
        >

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
            justifyContent="space-between"
            spacing={1.5}
          >

            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#1E293B",
                }}
              >
                User Accounts
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: 10.5,
                  color: "#94A3B8",
                }}
              >
                {filteredUsers.length} users displayed
              </Typography>
            </Box>


            <Stack
              direction="row"
              spacing={1}
            >

              <TextField
                size="small"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search users..."
                sx={{
                  width: {
                    xs: "100%",
                    sm: 260,
                  },

                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 11.5,
                    bgcolor: "#F8FAFC",
                  },

                  "& input": {
                    py: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded
                        sx={{
                          fontSize: 18,
                          color: "#94A3B8",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <Tooltip title="Refresh">
                <IconButton
                  size="small"
                  sx={{
                    width: 38,
                    height: 38,
                    border:
                      "1px solid #E2E8F0",
                    borderRadius: 2,
                    color: "#64748B",
                  }}
                >
                  <RefreshRounded
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </IconButton>
              </Tooltip>

            </Stack>

          </Stack>

        </Box>


        <Divider />


        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            overflowX: "auto",
          }}
        >

          {/* Table Header */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1.25fr 1.35fr 1.25fr 1.2fr 55px",
              alignItems: "center",
              minWidth: 950,
              px: 2.5,
              py: 1.35,
              bgcolor: "#F8FAFC",
              borderBottom:
                "1px solid #E2E8F0",
            }}
          >

            {[
              "USER",
              "ROLE",
              "DEPARTMENT",
              "STATUS",
              "LAST LOGIN",
              "",
            ].map((label) => (
              <Typography
                key={label}
                sx={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#94A3B8",
                }}
              >
                {label}
              </Typography>
            ))}

          </Box>


          {/* Rows */}

          {filteredUsers.map((user) => (

            <Box
              key={user.id}
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "2fr 1.25fr 1.35fr 1.25fr 1.2fr 55px",
                alignItems: "center",
                minWidth: 950,
                px: 2.5,
                py: 1.65,
                borderBottom:
                  "1px solid #F1F5F9",
                transition:
                  "background .18s ease",

                "&:hover": {
                  bgcolor: "#FAFCFF",
                },
              }}
            >

              {/* User */}

              <Stack
                direction="row"
                alignItems="center"
                spacing={1.3}
              >

                <Avatar
                  sx={{
                    width: 37,
                    height: 37,
                    fontSize: 11,
                    fontWeight: 800,
                    bgcolor:
                      "rgba(37,99,235,.10)",
                    color: "#2563EB",
                  }}
                >
                  {user.initials}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 750,
                      color: "#1E293B",
                    }}
                  >
                    {user.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.2,
                      fontSize: 10,
                      color: "#94A3B8",
                    }}
                  >
                    @{user.username}
                  </Typography>
                </Box>

              </Stack>


              {/* Role */}

              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                {user.role}
              </Typography>


              {/* Department */}

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#64748B",
                }}
              >
                {user.department}
              </Typography>


              {/* Status */}

              <Chip
                icon={
                  user.status === "Active" ? (
                    <CheckCircleRounded
                      sx={{
                        fontSize: 14,
                      }}
                    />
                  ) : (
                    <BlockRounded
                      sx={{
                        fontSize: 14,
                      }}
                    />
                  )
                }
                label={user.status}
                size="small"
                sx={{
                  width: "fit-content",
                  height: 25,
                  borderRadius: 1.5,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor:
                    user.status === "Active"
                      ? "rgba(5,150,105,.08)"
                      : "rgba(220,38,38,.07)",
                  color:
                    user.status === "Active"
                      ? "#059669"
                      : "#DC2626",

                  "& .MuiChip-icon": {
                    color: "inherit",
                  },
                }}
              />


              {/* Last Login */}

              <Typography
                sx={{
                  fontSize: 10.5,
                  color: "#64748B",
                }}
              >
                {user.lastLogin}
              </Typography>


              {/* Actions */}

              <Stack
                direction="row"
                justifyContent="flex-end"
              >

                <Tooltip title="Edit user">
                  <IconButton
                    size="small"
                    sx={{
                      color: "#64748B",
                      "&:hover": {
                        color: "#2563EB",
                        bgcolor:
                          "rgba(37,99,235,.07)",
                      },
                    }}
                  >
                    <EditRounded
                      sx={{
                        fontSize: 17,
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title="More">
                  <IconButton
                    size="small"
                    sx={{
                      color: "#94A3B8",
                    }}
                  >
                    <MoreVertRounded
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  </IconButton>
                </Tooltip>

              </Stack>

            </Box>

          ))}


          {/* Empty */}

          {filteredUsers.length === 0 && (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >

              <PersonSearchRounded
                sx={{
                  fontSize: 42,
                  color: "#CBD5E1",
                }}
              />

              <Typography
                sx={{
                  mt: 1,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#475569",
                }}
              >
                No users found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 11,
                  color: "#94A3B8",
                }}
              >
                Try another search term.
              </Typography>

            </Box>
          )}

        </Box>


        {/* =================================================
            MOBILE
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
          }}
        >

          {filteredUsers.map((user) => (

            <Box
              key={user.id}
              sx={{
                px: 2,
                py: 1.8,
                borderBottom:
                  "1px solid #F1F5F9",
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1}
              >

                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >

                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: 11,
                      fontWeight: 800,
                      bgcolor:
                        "rgba(37,99,235,.10)",
                      color: "#2563EB",
                    }}
                  >
                    {user.initials}
                  </Avatar>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 750,
                        color: "#1E293B",
                      }}
                    >
                      {user.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 10,
                        color: "#94A3B8",
                      }}
                    >
                      @{user.username}
                    </Typography>
                  </Box>

                </Stack>


                <IconButton
                  size="small"
                >
                  <MoreVertRounded
                    sx={{
                      fontSize: 18,
                    }}
                  />
                </IconButton>

              </Stack>


              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{
                  mt: 1.4,
                  gap: 0.7,
                }}
              >

                <Chip
                  size="small"
                  label={user.role}
                  sx={{
                    height: 24,
                    fontSize: 9.5,
                    bgcolor: "#F8FAFC",
                    border:
                      "1px solid #E2E8F0",
                  }}
                />

                <Chip
                  size="small"
                  label={user.status}
                  sx={{
                    height: 24,
                    fontSize: 9.5,
                    fontWeight: 700,
                    bgcolor:
                      user.status === "Active"
                        ? "rgba(5,150,105,.08)"
                        : "rgba(220,38,38,.07)",
                    color:
                      user.status === "Active"
                        ? "#059669"
                        : "#DC2626",
                  }}
                />

              </Stack>


              <Typography
                sx={{
                  mt: 1,
                  fontSize: 10,
                  color: "#94A3B8",
                }}
              >
                {user.department} • Last login:{" "}
                {user.lastLogin}
              </Typography>

            </Box>

          ))}

        </Box>

      </Card>


      {/* =====================================================
          SECURITY FOOTNOTE
      ===================================================== */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          mt: 2,
          px: 1,
        }}
      >

        <SecurityRounded
          sx={{
            fontSize: 16,
            color: "#94A3B8",
          }}
        />

        <Typography
          sx={{
            fontSize: 10,
            color: "#94A3B8",
          }}
        >
          User access is controlled by roles and permissions.
        </Typography>

      </Stack>

    </Box>
  );
}