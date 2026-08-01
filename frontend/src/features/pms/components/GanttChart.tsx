import {
    Box,
    Typography
} from "@mui/material";


import type {
    GanttActivity
} from "../api/ganttApi";



interface Props {

    activities: GanttActivity[];

}



export default function GanttChart({

    activities

}: Props) {


    if (!activities || activities.length === 0) {

        return (

            <Typography
                color="text.secondary"
            >
                No schedule activities found.
            </Typography>

        );

    }



    return (

        <Box>


            {
                activities.map(activity => (

                    <Box

                        key={activity.id}

                        sx={{
                            mb:2
                        }}

                    >


                        <Typography

                            variant="body2"

                            fontWeight={700}

                        >

                            {activity.code}
                            {" - "}
                            {activity.name}

                        </Typography>



                        <Box

                            sx={{

                                height:28,

                                background:"#E5E7EB",

                                borderRadius:1,

                                overflow:"hidden"

                            }}

                        >


                            <Box

                                sx={{

                                    width:
                                    `${activity.duration * 5}px`,

                                    height:"100%",


                                    background:

                                    activity.isCritical

                                    ?

                                    "#DC2626"

                                    :

                                    "#2563EB",


                                    display:"flex",

                                    alignItems:"center",

                                    pl:1

                                }}

                            >


                                <Typography

                                    color="white"

                                    fontSize={12}

                                >

                                    {activity.progress}%

                                </Typography>


                            </Box>


                        </Box>


                    </Box>


                ))

            }


        </Box>

    );

}