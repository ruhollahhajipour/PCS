import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

import {
  useState
} from "react";


import WbsSetupService
from "../../services/wbs.setup.service";



type Props = {

  projectId:string;

  onComplete:()=>void;

};



export default function WbsStep({

  projectId,

  onComplete,

}:Props){


  const [file,setFile] =
    useState<File | null>(null);



  async function downloadTemplate(){


    const blob =
      await WbsSetupService.downloadTemplate();



    const url =
      window.URL.createObjectURL(blob);



    const link =
      document.createElement("a");



    link.href=url;


    link.download=
      "PCS-PMS-Import-Template.xlsx";


    link.click();



    window.URL.revokeObjectURL(url);

  }






  async function importFile(){


    if(!file)
      return;



    await WbsSetupService.importExcel(

      projectId,

      file

    );


    onComplete();

  }






  return (

    <Box>


      <Typography
        variant="h6"
        mb={3}
      >
        WBS Setup
      </Typography>




      <Button

        variant="outlined"

        startIcon={<DownloadIcon/>}

        onClick={downloadTemplate}

      >

        Download Excel Template

      </Button>





      <Box mt={4}>


        <input

          type="file"

          accept=".xlsx"

          onChange={(e)=>

            setFile(
              e.target.files?.[0] ?? null
            )

          }

        />


      </Box>





      <Button

        sx={{
          mt:3
        }}

        variant="contained"

        startIcon={<UploadIcon/>}

        disabled={!file}

        onClick={importFile}

      >

        Import WBS


      </Button>


    </Box>

  );

}