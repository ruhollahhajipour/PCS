import {
  Box,
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
  BusinessRounded,
  ApartmentRounded,
  FolderRounded,
  AccountBalanceWalletRounded,
  WarehouseRounded,
  ShoppingCartRounded,
  DescriptionRounded,
  BarChartRounded,
  SettingsRounded,
} from "@mui/icons-material";


import { NavLink } from "react-router-dom";



const menu = [

  {
    text: "Dashboard",
    icon: <DashboardRounded />,
    path: "/dashboard",
  },

  {
    text: "Companies",
    icon: <BusinessRounded />,
    path: "/companies",
  },

  {
    text: "Plants",
    icon: <ApartmentRounded />,
    path: "/plants",
  },

  {
    text: "Projects",
    icon: <FolderRounded />,
    path: "/projects",
  },

  {
    text: "Cost Control",
    icon: <AccountBalanceWalletRounded />,
    path: "/cost-control",
  },

  {
    text: "Procurement",
    icon: <ShoppingCartRounded />,
    path: "/procurement",
  },

  {
    text: "Warehouse",
    icon: <WarehouseRounded />,
    path: "/warehouse",
  },

  {
    text: "Materials",
    icon: <WarehouseRounded />,
    path: "/materials",
  },

  {
    text: "Vendors",
    icon: <BusinessRounded />,
    path: "/vendors",
  },

  {
    text: "Documents",
    icon: <DescriptionRounded />,
    path: "/documents",
  },

  {
    text: "Reports",
    icon: <BarChartRounded />,
    path: "/reports",
  },

  {
    text: "Administration",
    icon: <SettingsRounded />,
    path: "/settings",
  },

  

];



export default function Sidebar() {


  return (

    <Box
      sx={{
        width: 285,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg,#182434 0%,#22364C 100%)",
        color: "#fff",
        borderRight:
          "1px solid rgba(255,255,255,.08)",
      }}
    >


      <Box
        sx={{
          py:4,
          px:3,
          textAlign:"center",
        }}
      >

        <Typography
          fontWeight={800}
          fontSize={23}
        >
          PCS
        </Typography>


        <Typography
          fontSize={14}
          color="#B8C6D8"
          mt={0.5}
        >
          Project Control System
        </Typography>


        <Chip
          label="KNG Enterprise"
          color="primary"
          size="small"
          sx={{
            mt:2
          }}
        />


      </Box>



      <Divider
        sx={{
          borderColor:
          "rgba(255,255,255,.08)"
        }}
      />



      <List
        sx={{
          px:2,
          py:2,
          flex:1
        }}
      >

        {menu.map((item)=>(

          <ListItemButton

            key={item.text}

            component={NavLink}

            to={item.path}


            sx={{

              borderRadius:3,

              mb:1,

              py:1.3,

              color:"#E5EDF8",


              "& .MuiListItemIcon-root":{
                color:"#E5EDF8",
                minWidth:42,
              },


              "&.active":{

                background:
                "linear-gradient(90deg,#2563EB,#4F46E5)",

                color:"#fff",

                "& .MuiListItemIcon-root":{
                  color:"#fff",
                },

              },

            }}

          >

            <ListItemIcon>

              {item.icon}

            </ListItemIcon>


            <ListItemText

              primary={item.text}

              primaryTypographyProps={{
                fontWeight:600,
                fontSize:15,
              }}

            />

          </ListItemButton>


        ))}


      </List>



      <Divider
        sx={{
          borderColor:
          "rgba(255,255,255,.08)"
        }}
      />


      <Box
        sx={{
          p:3
        }}
      >

        <Typography fontWeight={700}>
          Kousha Gaman Namavar
        </Typography>


        <Typography
          color="#9FB3C8"
          fontSize={13}
          mt={0.5}
        >
          Version 1.0.0
        </Typography>


      </Box>


    </Box>

  );

}