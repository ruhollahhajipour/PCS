import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import type { Project } from "../types/project";


type Props = {
  projects: Project[];
};



export default function CriticalProjectsTable({
  projects,
}: Props) {


  const navigate = useNavigate();



  const criticalProjects = projects.filter(
    (x) => {

      const spi =
        x.spi ?? 1;

      const cpi =
        x.cpi ?? 1;

      const progress =
        x.progress ?? 0;


      return (
        spi < 0.9 ||
        cpi < 0.9 ||
        progress < 50
      );

    }
  );



  function getStatus(project: Project) {


    const spi =
      project.spi ?? 1;


    const cpi =
      project.cpi ?? 1;



    if (
      spi < 0.8 ||
      cpi < 0.8
    ) {

      return {
        label: "Critical",
        color: "error" as const,
      };

    }



    if (
      spi < 0.9 ||
      cpi < 0.9
    ) {

      return {
        label: "Warning",
        color: "warning" as const,
      };

    }



    return {
      label: "Healthy",
      color: "success" as const,
    };

  }




  return (

    <Card
      sx={{
        borderRadius: 4,
      }}
    >

      <CardContent>


        <Typography
          variant="h6"
          fontWeight={700}
          mb={2}
        >
          Critical Projects
        </Typography>



        <TableContainer>

          <Table>


            <TableHead>

              <TableRow>

                <TableCell>
                  Code
                </TableCell>

                <TableCell>
                  Project
                </TableCell>

                <TableCell>
                  Progress
                </TableCell>

                <TableCell>
                  SPI
                </TableCell>

                <TableCell>
                  CPI
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

              </TableRow>

            </TableHead>



            <TableBody>


              {
                criticalProjects.map((project) => {


                  const status =
                    getStatus(project);



                  return (

                    <TableRow

                      key={project.id}

                      hover

                      sx={{
                        cursor: "pointer",
                      }}

                      onClick={() =>
                        navigate(
                          `/projects/${project.id}`
                        )
                      }

                    >


                      <TableCell>

                        {project.code}

                      </TableCell>



                      <TableCell>

                        {project.name}

                      </TableCell>



                      <TableCell>

                        {project.progress ?? 0} %

                      </TableCell>



                      <TableCell>

                        {project.spi ?? 0}

                      </TableCell>



                      <TableCell>

                        {project.cpi ?? 0}

                      </TableCell>



                      <TableCell>


                        <Chip

                          label={
                            status.label
                          }

                          color={
                            status.color
                          }

                          size="small"

                        />


                      </TableCell>



                    </TableRow>

                  );


                })
              }


            </TableBody>


          </Table>

        </TableContainer>


      </CardContent>


    </Card>

  );

}