import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";


export type LegendItem = {

    name:string;

    color:string;

    value?:string | number;

};



type Props = {

    items:LegendItem[];

    direction?:
        "row" | "column";

};



export default function ChartLegend({

    items,

    direction="row",

}:Props){


    return (

        <Stack

            direction={direction}

            spacing={2}

            flexWrap="wrap"

            useFlexGap

        >

            {
                items.map(

                    (item)=>(

                        <Box

                            key={item.name}

                            display="flex"

                            alignItems="center"

                            gap={1}

                        >


                            <Box

                                sx={{

                                    width:10,

                                    height:10,

                                    borderRadius:"50%",

                                    backgroundColor:
                                        item.color,

                                }}

                            />



                            <Typography

                                variant="body2"

                                color="text.secondary"

                            >

                                {item.name}

                            </Typography>



                            {
                                item.value !== undefined &&

                                <Typography

                                    variant="body2"

                                    fontWeight={700}

                                >

                                    {item.value}

                                </Typography>

                            }



                        </Box>

                    )

                )
            }


        </Stack>

    );

}