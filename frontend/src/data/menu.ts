import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import WorkspacesRoundedIcon from "@mui/icons-material/WorkspacesRounded";

const menu = [
  {
    title: "Workspace",
    icon: WorkspacesRoundedIcon,
    path: "/workspace",
  },
  {
    title: "Dashboard",
    icon: DashboardRoundedIcon,
    path: "/dashboard",
  },
  {
    title: "Companies",
    icon: BusinessRoundedIcon,
    path: "/companies",
  },
  {
    title: "Plants",
    icon: ApartmentRoundedIcon,
    path: "/plants",
  },
  {
    title: "Projects",
    icon: AccountTreeRoundedIcon,
    path: "/projects",
  },
  {
    title: "Cost Control",
    icon: PaidRoundedIcon,
    path: "/cost-control",
  },
  {
    title: "Procurement",
    icon: ShoppingCartRoundedIcon,
    path: "/procurement",
  },
  {
    title: "Warehouse",
    icon: WarehouseRoundedIcon,
    path: "/warehouse",
  },
  {
    title: "Documents",
    icon: DescriptionRoundedIcon,
    path: "/documents",
  },
  {
    title: "Reports",
    icon: AssessmentRoundedIcon,
    path: "/reports",
  },
];

export default menu;