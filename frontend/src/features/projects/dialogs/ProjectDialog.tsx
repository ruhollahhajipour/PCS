import {
  useEffect,
  useState,
} from "react";

import {
  Grid,
} from "@mui/material";


import PCSDialog
from "../../../components/Common/Form/PCSDialog";


import PCSFormActions
from "../../../components/Common/Form/PCSFormActions";


import PCSTextField
from "../../../components/Common/Form/PCSTextField";


import type { Project }
from "../../../models/project";





const initialForm: Project = {

  id:"",

  code:"",

  name:"",

  shortName:"",

  description:"",

  companyId:"",

  plantId:"",

  contractNo:"",

  client:"",

  contractor:"",

  consultant:"",

  startDate:"",

  endDate:"",

  budget:0,

  actualCost:0,

  currency:"USD",

  progress:0,

  spi:1,

  cpi:1,

  isActive:true,

};







type Props = {

  open:boolean;

  project:Project | null;

  onClose:()=>void;

  onSave:(project:Project)=>Promise<void>;

};









export default function ProjectDialog({

  open,

  project,

  onClose,

  onSave,

}:Props){



  const [form,setForm] =
    useState<Project>(
      initialForm
    );



  const [loading,setLoading] =
    useState(false);







  useEffect(()=>{

    if(!open)
      return;


    setForm(
      project ?? initialForm
    );


  },[
    open,
    project
  ]);








  function handleChange(
    e:React.ChangeEvent<HTMLInputElement>
  ){

    const {
      name,
      value
    } = e.target;



    setForm({

      ...form,


      [name]:

        [
          "budget",
          "actualCost",
          "progress",
          "spi",
          "cpi",

        ].includes(name)

        ? Number(value)

        : value,


    });


  }









  async function handleSubmit(
    e:React.FormEvent
  ){

    e.preventDefault();


    try{

      setLoading(true);


      await onSave(
        form
      );


      onClose();


    }
    catch(error){

      console.error(
        "Project save failed",
        error
      );


    }
    finally{

      setLoading(false);

    }

  }








  return (

    <PCSDialog

      open={open}

      title={
        project
          ? "Edit Project"
          : "New Project"
      }

      width="lg"

      onClose={onClose}

    >


      <form
        onSubmit={handleSubmit}
      >


        <Grid
          container
          spacing={2}
        >


          <Grid size={{xs:12,md:3}}>

            <PCSTextField

              label="Code"

              name="code"

              value={form.code}

              onChange={handleChange}

            />

          </Grid>




          <Grid size={{xs:12,md:9}}>

            <PCSTextField

              label="Project Name"

              name="name"

              value={form.name}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:6}}>

            <PCSTextField

              label="Company Id"

              name="companyId"

              value={form.companyId}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:6}}>

            <PCSTextField

              label="Plant Id"

              name="plantId"

              value={form.plantId ?? ""}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:6}}>

            <PCSTextField

              label="Contract No"

              name="contractNo"

              value={form.contractNo ?? ""}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Client"

              name="client"

              value={form.client ?? ""}

              onChange={handleChange}

            />

          </Grid>




          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Contractor"

              name="contractor"

              value={form.contractor ?? ""}

              onChange={handleChange}

            />

          </Grid>




          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Consultant"

              name="consultant"

              value={form.consultant ?? ""}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:6}}>

            <PCSTextField

              label="Start Date"

              name="startDate"

              value={form.startDate}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:6}}>

            <PCSTextField

              label="End Date"

              name="endDate"

              value={form.endDate ?? ""}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Budget"

              name="budget"

              value={String(form.budget)}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Actual Cost"

              name="actualCost"

              value={String(form.actualCost)}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Currency"

              name="currency"

              value={form.currency}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="Progress"

              name="progress"

              value={String(form.progress)}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="SPI"

              name="spi"

              value={String(form.spi)}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={{xs:12,md:4}}>

            <PCSTextField

              label="CPI"

              name="cpi"

              value={String(form.cpi)}

              onChange={handleChange}

            />

          </Grid>





          <Grid size={12}>

            <PCSTextField

              label="Description"

              name="description"

              value={form.description ?? ""}

              onChange={handleChange}

            />

          </Grid>


        </Grid>





        <PCSFormActions

          loading={loading}

          onCancel={onClose}

        />


      </form>


    </PCSDialog>

  );

}