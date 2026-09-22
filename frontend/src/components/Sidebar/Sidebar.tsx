import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from "@mui/material";

import {
  DashboardRounded,
  AccountTreeRounded,
  ScheduleRounded,
  TrendingUpRounded,
  EngineeringRounded,
  PrecisionManufacturingRounded,
  ElectricalServicesRounded,
  DeviceHubRounded,
  DescriptionRounded,
  Inventory2Rounded,
  LocalShippingRounded,
  StoreRounded,
  WarehouseRounded,
  ConstructionRounded,
  FactCheckRounded,
  AssignmentTurnedInRounded,
  SettingsSuggestRounded,
  AttachMoneyRounded,
  PaymentsRounded,
  AssessmentRounded,
  BuildRounded,
  HandymanRounded,
  AssignmentRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  BusinessCenterRounded,
  FolderSpecialRounded,
  SwapHorizRounded,
  InputRounded,
  OutputRounded,
  ChecklistRounded,
  BusinessRounded,
  ApartmentRounded,
} from "@mui/icons-material";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import icon from "../../assets/brand/icon.png";


/* =========================================================
   TYPES
========================================================= */

type MenuChild = {
  text: string;
  path: string;
  icon?: ReactNode;
};

type MenuSection = {
  id: string;
  text: string;
  icon: ReactNode;
  children: MenuChild[];
};


/* =========================================================
   MENU CONFIGURATION
========================================================= */

const menuSections: MenuSection[] = [

  /* =======================================================
     MASTER DATA
  ======================================================= */

  {
    id: "master-data",
    text: "Master Data",
    icon: <BusinessRounded />,
    children: [
      {
        text: "Companies",
        path: "/companies",
        icon: <BusinessRounded />,
      },
      {
        text: "Plants",
        path: "/plants",
        icon: <ApartmentRounded />,
      },
    ],
  },


  /* =======================================================
     PROJECT
  ======================================================= */

  {
    id: "project",
    text: "Project",
    icon: <AccountTreeRounded />,
    children: [
      {
        text: "Projects",
        path: "/projects",
        icon: <BusinessCenterRounded />,
      },
      {
        text: "WBS",
        path: "/projects/wbs",
        icon: <AccountTreeRounded />,
      },
      {
        text: "Schedule & Planning",
        path: "/pms",
        icon: <ScheduleRounded />,
      },
      {
        text: "Progress",
        path: "/projects/progress",
        icon: <TrendingUpRounded />,
      },
      {
        text: "Project Controls",
        path: "/projects/controls",
        icon: <AssessmentRounded />,
      },
    ],
  },


  /* =======================================================
     ENGINEERING
  ======================================================= */

  {
    id: "engineering",
    text: "Engineering",
    icon: <EngineeringRounded />,
    children: [
      {
        text: "Engineering Overview",
        path: "/engineering",
        icon: <EngineeringRounded />,
      },
      {
        text: "Piping",
        path: "/engineering/piping",
        icon: <DeviceHubRounded />,
      },
      {
        text: "Mechanical",
        path: "/engineering/mechanical",
        icon: <PrecisionManufacturingRounded />,
      },
      {
        text: "Electrical",
        path: "/engineering/electrical",
        icon: <ElectricalServicesRounded />,
      },
      {
        text: "Instrumentation",
        path: "/engineering/instrumentation",
        icon: <SettingsSuggestRounded />,
      },
      {
        text: "Engineering Deliverables",
        path: "/engineering/deliverables",
        icon: <DescriptionRounded />,
      },
      {
        text: "Holds & Punch",
        path: "/engineering/holds",
        icon: <ChecklistRounded />,
      },
    ],
  },


  /* =======================================================
     PROCUREMENT & MATERIALS
  ======================================================= */

  {
    id: "procurement-materials",
    text: "Procurement & Materials",
    icon: <LocalShippingRounded />,
    children: [
      {
        text: "Procurement",
        path: "/procurement",
        icon: <LocalShippingRounded />,
      },
      {
        text: "Material Control",
        path: "/materials",
        icon: <Inventory2Rounded />,
      },
      {
        text: "Expediting",
        path: "/procurement/expediting",
        icon: <TrendingUpRounded />,
      },
      {
        text: "Vendors",
        path: "/vendors",
        icon: <StoreRounded />,
      },
      {
        text: "Material Status",
        path: "/materials/status",
        icon: <AssessmentRounded />,
      },
    ],
  },


  /* =======================================================
     WAREHOUSE & LOGISTICS
  ======================================================= */

  {
    id: "warehouse-logistics",
    text: "Warehouse & Logistics",
    icon: <WarehouseRounded />,
    children: [
      {
        text: "Warehouse Overview",
        path: "/warehouse",
        icon: <WarehouseRounded />,
      },
      {
        text: "Receiving",
        path: "/warehouse/receiving",
        icon: <InputRounded />,
      },
      {
        text: "Issue Material",
        path: "/warehouse/issue",
        icon: <OutputRounded />,
      },
      {
        text: "Transfer",
        path: "/warehouse/transfer",
        icon: <SwapHorizRounded />,
      },
      {
        text: "Inventory & Stock",
        path: "/warehouse/stock",
        icon: <Inventory2Rounded />,
      },
      {
        text: "Inventory Count",
        path: "/warehouse/inventory-count",
        icon: <ChecklistRounded />,
      },
      {
        text: "Preservation",
        path: "/warehouse/preservation",
        icon: <FolderSpecialRounded />,
      },
    ],
  },


  /* =======================================================
     CONSTRUCTION
  ======================================================= */

  {
    id: "construction",
    text: "Construction",
    icon: <ConstructionRounded />,
    children: [
      {
        text: "Construction Overview",
        path: "/construction",
        icon: <ConstructionRounded />,
      },
      {
        text: "Discipline Progress",
        path: "/construction/progress",
        icon: <TrendingUpRounded />,
      },
      {
        text: "Quantities",
        path: "/construction/quantities",
        icon: <AssessmentRounded />,
      },
      {
        text: "Holds",
        path: "/construction/holds",
        icon: <FactCheckRounded />,
      },
      {
        text: "Punch List",
        path: "/construction/punch-list",
        icon: <AssignmentTurnedInRounded />,
      },
    ],
  },


  /* =======================================================
     PRE-COMMISSIONING & COMMISSIONING
  ======================================================= */

  {
    id: "commissioning",
    text: "Pre-Commissioning & Commissioning",
    icon: <FactCheckRounded />,
    children: [
      {
        text: "ICAPS Overview",
        path: "/commissioning",
        icon: <FactCheckRounded />,
      },
      {
        text: "Systems",
        path: "/commissioning/systems",
        icon: <AccountTreeRounded />,
      },
      {
        text: "Subsystems",
        path: "/commissioning/subsystems",
        icon: <DeviceHubRounded />,
      },
      {
        text: "Check Sheets",
        path: "/commissioning/check-sheets",
        icon: <ChecklistRounded />,
      },
      {
        text: "Test Packages",
        path: "/commissioning/test-packages",
        icon: <AssignmentRounded />,
      },
      {
        text: "Punch",
        path: "/commissioning/punch",
        icon: <FactCheckRounded />,
      },
      {
        text: "Turnover",
        path: "/commissioning/turnover",
        icon: <AssignmentTurnedInRounded />,
      },
      {
        text: "Commissioning Progress",
        path: "/commissioning/progress",
        icon: <TrendingUpRounded />,
      },
      {
        text: "Commissioning Reports",
        path: "/commissioning/reports",
        icon: <AssessmentRounded />,
      },
    ],
  },


  /* =======================================================
     COST & COMMERCIAL
  ======================================================= */

  {
    id: "cost-commercial",
    text: "Cost & Commercial",
    icon: <AttachMoneyRounded />,
    children: [
      {
        text: "Cost Control",
        path: "/cost-control",
        icon: <AttachMoneyRounded />,
      },
      {
        text: "Budget",
        path: "/cost-control/budget",
        icon: <PaymentsRounded />,
      },
      {
        text: "Commitments",
        path: "/cost-control/commitments",
        icon: <AssignmentRounded />,
      },
      {
        text: "Actual Cost",
        path: "/cost-control/actual",
        icon: <PaymentsRounded />,
      },
      {
        text: "EVM",
        path: "/cost-control/evm",
        icon: <TrendingUpRounded />,
      },
      {
        text: "Cash Flow",
        path: "/cost-control/cash-flow",
        icon: <AssessmentRounded />,
      },
    ],
  },


  /* =======================================================
     MAINTENANCE
  ======================================================= */

  {
    id: "maintenance",
    text: "Maintenance",
    icon: <BuildRounded />,
    children: [
      {
        text: "CMMS Overview",
        path: "/maintenance",
        icon: <BuildRounded />,
      },
      {
        text: "Equipment",
        path: "/maintenance/equipment",
        icon: <PrecisionManufacturingRounded />,
      },
      {
        text: "Work Orders",
        path: "/maintenance/work-orders",
        icon: <AssignmentRounded />,
      },
      {
        text: "Preventive Maintenance",
        path: "/maintenance/preventive",
        icon: <ChecklistRounded />,
      },
      {
        text: "Corrective Maintenance",
        path: "/maintenance/corrective",
        icon: <HandymanRounded />,
      },
      {
        text: "Spare Parts",
        path: "/maintenance/spare-parts",
        icon: <Inventory2Rounded />,
      },
      {
        text: "Maintenance History",
        path: "/maintenance/history",
        icon: <DescriptionRounded />,
      },
    ],
  },
];


/* =========================================================
   HELPERS
========================================================= */

function pathMatches(
  path: string,
  currentPath: string
): boolean {
  return (
    currentPath === path ||
    currentPath.startsWith(`${path}/`)
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar() {
  const location = useLocation();


  /* =======================================================
     ACTIVE SECTIONS
  ======================================================= */

  const activeSectionIds = useMemo(
    () =>
      menuSections
        .filter((section) =>
          section.children.some((child) =>
            pathMatches(
              child.path,
              location.pathname
            )
          )
        )
        .map((section) => section.id),

    [location.pathname]
  );


  /* =======================================================
     OPEN SECTIONS
  ======================================================= */

  const [
    openSections,
    setOpenSections,
  ] = useState<string[]>(
    activeSectionIds
  );


  /*
   * Keep the section containing the current route
   * open automatically.
   */

  useEffect(() => {
    if (activeSectionIds.length === 0) {
      return;
    }

    setOpenSections((current) => {
      const next = new Set(current);

      activeSectionIds.forEach((id) => {
        next.add(id);
      });

      return Array.from(next);
    });
  }, [activeSectionIds]);


  function toggleSection(id: string) {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }


  return (
    <Box
      sx={{
        width: 285,
        height: "100vh",

        display: "flex",
        flexDirection: "column",

        flexShrink: 0,

        background:
          "linear-gradient(180deg, #0F172A 0%, #142033 100%)",

        color: "#FFFFFF",

        borderRight:
          "1px solid rgba(255,255,255,.055)",

        overflow: "hidden",
      }}
    >

      {/* =====================================================
          BRAND
      ===================================================== */}

      <Box
        sx={{
          px: 2.75,
          pt: 2.4,
          pb: 2.15,
          flexShrink: 0,
        }}
      >

        <Box
          sx={{
            width: "100%",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            mb: 1.25,
          }}
        >

          <Box
            component="img"
            src={icon}
            alt="PCS"
            sx={{
              display: "block",

              width: "auto",
              height: 88,
              maxWidth: "245px",

              objectFit: "contain",

              filter:
                "drop-shadow(0 5px 12px rgba(0,0,0,.18))",

              userSelect: "none",
            }}
          />

        </Box>


        <Box
          sx={{
            textAlign: "center",
          }}
        >

          <Typography
            sx={{
              fontSize: 18,
              lineHeight: 1.15,

              fontWeight: 700,

              letterSpacing: "-0.02em",

              color: "#F8FAFC",
            }}
          >
            Project Control Suite
          </Typography>


          <Typography
            sx={{
              mt: 0.4,

              color: "#8FA3B9",

              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            Integrated Project Management
          </Typography>

        </Box>


        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >

          <Chip
            label="KNG Enterprise"
            size="small"
            sx={{
              mt: 1.55,

              height: 24,

              borderRadius: 1.5,

              bgcolor:
                "rgba(37,99,235,.10)",

              color: "#AFC7FF",

              border:
                "1px solid rgba(96,165,250,.13)",

              fontSize: 10,
              fontWeight: 600,

              "& .MuiChip-label": {
                px: 1.15,
              },
            }}
          />

        </Box>

      </Box>


      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.065)",
        }}
      />


      {/* =====================================================
          SCROLLABLE NAVIGATION
      ===================================================== */}

      <Box
        sx={{
          flex: 1,

          minHeight: 0,

          overflowY: "auto",
          overflowX: "hidden",

          py: 1.35,
          px: 1.35,

          "&::-webkit-scrollbar": {
            width: 5,
          },

          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },

          "&::-webkit-scrollbar-thumb": {
            background:
              "rgba(255,255,255,.11)",

            borderRadius: 10,
          },

          "&::-webkit-scrollbar-thumb:hover": {
            background:
              "rgba(255,255,255,.18)",
          },
        }}
      >

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <List disablePadding>

          <ListItemButton
            component={NavLink}
            to="/dashboard"
            sx={{
              minHeight: 44,

              mb: 0.65,

              px: 1.25,

              borderRadius: 1.75,

              color: "#D8E3EF",

              transition:
                "background-color .16s ease, color .16s ease",

              "& .MuiListItemIcon-root": {
                minWidth: 38,

                color: "#91A4BA",

                transition:
                  "color .16s ease",
              },

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,.055)",
              },

              "&.active": {
                background:
                  "linear-gradient(90deg, #2563EB 0%, #315FD6 100%)",

                color: "#FFFFFF",

                boxShadow:
                  "0 5px 14px rgba(37,99,235,.18)",

                "& .MuiListItemIcon-root": {
                  color: "#FFFFFF",
                },
              },
            }}
          >

            <ListItemIcon>
              <DashboardRounded fontSize="small" />
            </ListItemIcon>


            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{
                sx: {
                  fontSize: 12.5,

                  fontWeight: 700,

                  letterSpacing:
                    "0.005em",
                },
              }}
            />

          </ListItemButton>

        </List>


        {/* ===================================================
            MODULE LABEL
        =================================================== */}

        <Typography
          sx={{
            px: 1.15,

            pt: 1.65,
            pb: 0.75,

            color: "#60758C",

            fontSize: 9,

            fontWeight: 700,

            letterSpacing:
              "0.105em",

            textTransform:
              "uppercase",
          }}
        >
          Modules
        </Typography>


        {/* ===================================================
            MODULES
        =================================================== */}

        <List disablePadding>

          {menuSections.map((section) => {

            const isOpen =
              openSections.includes(
                section.id
              );


            const isActive =
              section.children.some(
                (child) =>
                  pathMatches(
                    child.path,
                    location.pathname
                  )
              );


            return (
              <Box key={section.id}>

                {/* MODULE HEADER */}

                <ListItemButton
                  onClick={() =>
                    toggleSection(
                      section.id
                    )
                  }
                  sx={{
                    minHeight: 44,

                    mb: 0.25,

                    px: 1.25,

                    borderRadius: 1.75,

                    color: isActive
                      ? "#F8FAFC"
                      : "#C9D6E4",

                    bgcolor: isActive
                      ? "rgba(255,255,255,.045)"
                      : "transparent",

                    transition:
                      "background-color .16s ease",

                    "& .MuiListItemIcon-root": {
                      minWidth: 38,

                      color: isActive
                        ? "#73A1FF"
                        : "#8FA3B9",

                      transition:
                        "color .16s ease",
                    },

                    "&:hover": {
                      bgcolor:
                        "rgba(255,255,255,.055)",
                    },

                    "&:hover .MuiListItemIcon-root":
                      {
                        color: "#AFC7FF",
                      },
                  }}
                >

                  <ListItemIcon>
                    {section.icon}
                  </ListItemIcon>


                  <ListItemText
                    primary={section.text}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 12,

                        fontWeight: isActive
                          ? 700
                          : 600,

                        lineHeight: 1.25,

                        letterSpacing:
                          "0.002em",
                      },
                    }}
                  />


                  {isOpen ? (
                    <ExpandLessRounded
                      sx={{
                        fontSize: 18,
                        color: "#71859B",
                      }}
                    />
                  ) : (
                    <ExpandMoreRounded
                      sx={{
                        fontSize: 18,
                        color: "#71859B",
                      }}
                    />
                  )}

                </ListItemButton>


                {/* SUB MODULES */}

                <Collapse
                  in={isOpen}
                  timeout="auto"
                  unmountOnExit
                >

                  <List
                    disablePadding
                    sx={{
                      ml: 1.15,
                      pl: 1.1,

                      borderLeft:
                        "1px solid rgba(255,255,255,.065)",
                    }}
                  >

                    {section.children.map(
                      (child) => (

                        <ListItemButton
                          key={child.path}
                          component={NavLink}
                          to={child.path}
                          sx={{
                            minHeight: 34,

                            mb: 0.1,

                            px: 0.8,

                            borderRadius: 1.4,

                            color: "#91A4BA",

                            transition:
                              "background-color .14s ease, color .14s ease",

                            position: "relative",

                            "& .MuiListItemIcon-root":
                              {
                                minWidth: 27,

                                color: "#71869C",

                                transition:
                                  "color .14s ease",
                              },

                            "&:hover": {
                              bgcolor:
                                "rgba(255,255,255,.045)",

                              color: "#E5EDF7",

                              "& .MuiListItemIcon-root":
                                {
                                  color: "#9FBFFF",
                                },
                            },

                            "&.active": {
                              bgcolor:
                                "rgba(37,99,235,.16)",

                              color: "#FFFFFF",

                              "& .MuiListItemIcon-root":
                                {
                                  color: "#78A3FF",
                                },

                              "&:before": {
                                content: '""',

                                position:
                                  "absolute",

                                left: 0,

                                top: "50%",

                                width: 2,
                                height: 17,

                                borderRadius: 2,

                                bgcolor:
                                  "#4F8CFF",

                                transform:
                                  "translateY(-50%)",
                              },
                            },
                          }}
                        >

                          <ListItemIcon>
                            {child.icon}
                          </ListItemIcon>


                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{
                              sx: {
                                fontSize: 11,

                                fontWeight: 500,

                                lineHeight: 1.25,
                              },
                            }}
                          />

                        </ListItemButton>

                      )
                    )}

                  </List>

                </Collapse>

              </Box>
            );
          })}

        </List>


        {/* ===================================================
            INFORMATION
        =================================================== */}

        <Typography
          sx={{
            px: 1.15,

            pt: 1.65,
            pb: 0.75,

            color: "#60758C",

            fontSize: 9,

            fontWeight: 700,

            letterSpacing:
              "0.105em",

            textTransform:
              "uppercase",
          }}
        >
          Information
        </Typography>


        <List disablePadding>

          <ListItemButton
            component={NavLink}
            to="/documents"
            sx={{
              minHeight: 41,

              mb: 0.25,

              px: 1.25,

              borderRadius: 1.7,

              color: "#C9D6E4",

              "& .MuiListItemIcon-root": {
                minWidth: 37,

                color: "#8FA3B9",
              },

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,.055)",
              },

              "&.active": {
                bgcolor:
                  "rgba(37,99,235,.16)",

                color: "#FFFFFF",

                "& .MuiListItemIcon-root": {
                  color: "#78A3FF",
                },
              },
            }}
          >

            <ListItemIcon>
              <DescriptionRounded fontSize="small" />
            </ListItemIcon>


            <ListItemText
              primary="Documents"
              primaryTypographyProps={{
                sx: {
                  fontSize: 12,
                  fontWeight: 600,
                },
              }}
            />

          </ListItemButton>


          <ListItemButton
            component={NavLink}
            to="/reports"
            sx={{
              minHeight: 41,

              mb: 0.25,

              px: 1.25,

              borderRadius: 1.7,

              color: "#C9D6E4",

              "& .MuiListItemIcon-root": {
                minWidth: 37,

                color: "#8FA3B9",
              },

              "&:hover": {
                bgcolor:
                  "rgba(255,255,255,.055)",
              },

              "&.active": {
                bgcolor:
                  "rgba(37,99,235,.16)",

                color: "#FFFFFF",

                "& .MuiListItemIcon-root": {
                  color: "#78A3FF",
                },
              },
            }}
          >

            <ListItemIcon>
              <AssessmentRounded fontSize="small" />
            </ListItemIcon>


            <ListItemText
              primary="Reports"
              primaryTypographyProps={{
                sx: {
                  fontSize: 12,
                  fontWeight: 600,
                },
              }}
            />

          </ListItemButton>

        </List>

      </Box>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Divider
        sx={{
          borderColor:
            "rgba(255,255,255,.065)",
        }}
      />


      <Box
        sx={{
          px: 2.25,

          py: 1.55,

          flexShrink: 0,

          textAlign: "center",
        }}
      >

        <Typography
          sx={{
            color: "#DDE7F2",

            fontSize: 11,

            fontWeight: 650,
          }}
        >
          Kousha Gaman Namavar
        </Typography>


        <Typography
          sx={{
            color: "#8498AE",

            fontSize: 10,

            mt: 0.3,
          }}
        >
          Project Control Suite
        </Typography>


        <Typography
          sx={{
            color: "#6E8298",

            fontSize: 9,

            mt: 0.65,
          }}
        >
          Version 1.0.0
        </Typography>

      </Box>

    </Box>
  );
}