import {
    Box,
    Typography
} from "@mui/material";


export default function CriticalPathLegend()
{
    return (

        <Box
            display="flex"
            gap={3}
            mb={2}
        >

            <Typography>
                🔴 Critical Activity
            </Typography>


            <Typography>
                🔵 Normal Activity
            </Typography>

        </Box>

    );
}