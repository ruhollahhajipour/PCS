import type { SvgIconComponent } from "@mui/icons-material";

export interface MenuItem {
  title: string;

  path: string;

  icon: SvgIconComponent;

  children?: MenuItem[];
}