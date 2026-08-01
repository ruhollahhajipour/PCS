import type { ReactNode } from "react";


import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";


import MoreVertIcon from "@mui/icons-material/MoreVert";


import ChartHeader from "./ChartHeader";



type Props = {

    title:string;

    subtitle?:string;


    children:ReactNode;


    loading?:boolean;


    empty?:boolean;


    emptyMessage?:string;


    height?:number;


    action?:ReactNode;


    showMenu?:boolean;


    footer?:ReactNode;

};




export default function EnterpriseChartContainer({

    title,

    subtitle,

    children,

    loading=false,

    empty=false,

    emptyMessage="No data available",

    height=360,

    action,

    showMenu=true,

    footer,

}:Props){



    return (

        <Card

            elevation={0}

            sx={{

                borderRadius:3,

                border:"1px solid #E2E8F0",

                background:"#FFFFFF",

                height:"100%",

            }}

        >


            <CardContent

                sx={{

                    p:3,

                    "&:last-child":{

                        pb:3

                    }

                }}

            >



                <ChartHeader

                    title={title}

                    subtitle={subtitle}

                    action={

                        <Stack

                            direction="row"

                            spacing={1}

                        >

                            {action}



                            {

                                showMenu &&

                                <IconButton

                                    size="small"

                                >

                                    <MoreVertIcon/>

                                </IconButton>

                            }


                        </Stack>

                    }

                />




                <Box

                    height={height}

                    display="flex"

                    alignItems="center"

                    justifyContent="center"

                >


                    {

                        loading ?


                        <CircularProgress/>


                        :


                        empty ?


                        <Typography

                            color="text.secondary"

                        >

                            {emptyMessage}

                        </Typography>


                        :


                        children


                    }


                </Box>




                {

                    footer &&

                    <Box

                        mt={2}

                    >

                        {footer}

                    </Box>

                }


            </CardContent>


        </Card>

    );

}