import {
    useEffect,
    useState
} from "react";

import {
    Box,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";


import {
    useParams
} from "react-router-dom";


import GanttChart from "../components/GanttChart";

import CriticalPathLegend from "../components/CriticalPathLegend";


import {
    getProjectGantt,
    type GanttProject
} from "../api/ganttApi";



export default function ProjectSchedule()
{

    const { id } = useParams<{id:string}>();


    const [data,setData] =
        useState<GanttProject | null>(null);


    const [error,setError] =
        useState<string | null>(null);



    useEffect(()=>{

        console.log(
            "PROJECT SCHEDULE LOADED",
            id
        );


        if(!id)
        {
            setError(
                "Project ID not found"
            );

            return;
        }



        getProjectGantt(id)

            .then(response =>
            {
                console.log(
                    "GANTT DATA:",
                    response
                );

                if(response && response.activities)
{
    setData(response);
}
else
{
    setError(
        "Invalid schedule data received"
    );
}
            })


            .catch(err =>
            {
                console.error(
                    "GANTT ERROR:",
                    err
                );

                setError(
                    "Failed to load project schedule"
                );
            });


    },[id]);



    if(error)
    {
        return (

            <Box p={3}>

                <Alert severity="error">
                    {error}
                </Alert>

            </Box>

        );
    }



    if(!data)
    {
        return (

            <Box
                p={5}
                display="flex"
                alignItems="center"
                gap={2}
            >

                <CircularProgress />

                <Typography>
                    Loading Project Schedule...
                </Typography>


            </Box>

        );
    }



    return (

        <Box
            sx={{
                p:3
            }}
        >


            <Typography
                variant="h4"
                fontWeight={800}
                mb={3}
            >
                Project Schedule
            </Typography>



            <CriticalPathLegend />



            <Box mt={3}>

                <GanttChart

                    activities={
                        data.activities
                    }

                />

            </Box>


        </Box>

    );

}