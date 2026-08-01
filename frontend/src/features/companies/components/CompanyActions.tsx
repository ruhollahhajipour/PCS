import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Company } from "../types/company";


type Props = {

  company: Company;

  onEdit: (company: Company) => void;

  onDelete: (id:number)=>void;

};


export default function CompanyActions({

  company,

  onEdit,

  onDelete,

}:Props){


  return (

    <>

      <Tooltip title="Edit">

        <IconButton

          size="small"

          color="primary"

          onClick={()=>onEdit(company)}

        >

          <EditIcon fontSize="small"/>

        </IconButton>

      </Tooltip>



      <Tooltip title="Delete">

        <IconButton

          size="small"

          color="error"

          onClick={()=>onDelete(company.id)}

        >

          <DeleteIcon fontSize="small"/>

        </IconButton>

      </Tooltip>


    </>

  );

}