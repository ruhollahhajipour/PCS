import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import {
  People,
  Security,
  AdminPanelSettings,
  Business,
  Palette,
  Language,
  CurrencyExchange,
  Notifications,
  Email,
  Numbers,
} from "@mui/icons-material";


const items = [
  {
    title: "Users",
    description: "Manage system users",
    icon: <People />,
  },
  {
    title: "Roles",
    description: "Manage user roles",
    icon: <AdminPanelSettings />,
  },
  {
    title: "Permissions",
    description: "Access control management",
    icon: <Security />,
  },
  {
    title: "Company Profile",
    description: "Company information",
    icon: <Business />,
  },
  {
    title: "Branding",
    description: "Logo and appearance",
    icon: <Palette />,
  },
  {
    title: "Language",
    description: "System language",
    icon: <Language />,
  },
  {
    title: "Currency",
    description: "Currency settings",
    icon: <CurrencyExchange />,
  },
  {
    title: "Notifications",
    description: "Notification settings",
    icon: <Notifications />,
  },
  {
    title: "Email",
    description: "Email configuration",
    icon: <Email />,
  },
  {
    title: "Numbering",
    description: "Document numbering",
    icon: <Numbers />,
  },
];


export default function Settings() {

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Administration
      </Typography>


      <Grid container spacing={3}>

        {items.map((item)=>(

          <Grid
            key={item.title}
            size={{xs:12, sm:6, md:4}}
          >

            <Card
              sx={{
                height:"100%",
                cursor:"pointer",
                borderRadius:3,
                transition:"0.2s",
                "&:hover":{
                  transform:"translateY(-4px)",
                  boxShadow:4,
                }
              }}
            >

              <CardContent>

                <Box
                  sx={{
                    color:"primary.main",
                    mb:2
                  }}
                >
                  {item.icon}
                </Box>


                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {item.title}
                </Typography>


                <Typography
                  color="text.secondary"
                  mt={1}
                >
                  {item.description}
                </Typography>


              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>

    </Box>

  );
}