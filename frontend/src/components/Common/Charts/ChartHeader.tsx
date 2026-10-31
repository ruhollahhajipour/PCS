import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";


type Props = {

    title:string;

    subtitle?:string;


    action?:React.ReactNode;


    badge?:React.ReactNode;

};



export default function ChartHeader({

    title,

    subtitle,

    action,

    badge,

}:Props){


    return (

        <Stack

            direction="row"

            justifyContent="space-between"

            alignItems="flex-start"

            mb={2}

        >


            <Box>


                <Stack

                    direction="row"

                    spacing={1}

                    alignItems="center"

                >


                    <Typography

                        fontWeight={700}

                        fontSize={16}

                    >

                        {title}

                    </Typography>



                    {
                        badge
                    }


                </Stack>




                {
                    subtitle &&

                    <Typography

                        variant="body2"

                        color="text.secondary"

                        mt={0.5}

                    >

                        {subtitle}

                    </Typography>

                }


            </Box>



            {
                action
            }


        </Stack>


    );

}