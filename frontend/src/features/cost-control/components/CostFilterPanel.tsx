import {
  useMemo,
} from "react";


import FilterPanel
from "../../../components/Common/FilterPanel";


import SelectField
from "../../../components/Common/fields/SelectField";


import TextField
from "../../../components/Common/fields/TextField";


import type {
  CostItem,
} from "../types/costItem";



type Props = {

  items: CostItem[];

  project:string;

  discipline:string;

  status:string;

  search:string;


  setProject:(value:string)=>void;

  setDiscipline:(value:string)=>void;

  setStatus:(value:string)=>void;

  setSearch:(value:string)=>void;


  onReset:()=>void;

};




export default function CostFilterPanel({

  items,

  project,

  discipline,

  status,

  search,


  setProject,

  setDiscipline,

  setStatus,

  setSearch,


  onReset,


}:Props){



  const projectOptions = useMemo(()=>{


    const values =
      Array.from(
        new Set(
          items.map(
            x=>x.project
          )
        )
      );


    return [

      {
        value:"",
        label:"All Projects",
      },

      ...values.map(
        x=>({
          value:x,
          label:x,
        })
      ),

    ];


  },[items]);




  const disciplineOptions = useMemo(()=>{


    const values =
      Array.from(
        new Set(
          items.map(
            x=>x.discipline
          )
        )
      );


    return [

      {
        value:"",
        label:"All Disciplines",
      },

      ...values.map(
        x=>({
          value:x,
          label:x,
        })
      ),

    ];


  },[items]);





  const statusOptions = [

    {
      value:"",
      label:"All Status",
    },


    {
      value:"Normal",
      label:"Normal",
    },


    {
      value:"Warning",
      label:"Warning",
    },


    {
      value:"Critical",
      label:"Critical",
    },

  ];





  return (

    <FilterPanel

      onReset={onReset}

    >


      <SelectField

        label="Project"

        value={project}

        options={projectOptions}

        onChange={
          value =>
            setProject(
              String(value)
            )
        }

        fullWidth={false}

      />



      <SelectField

        label="Discipline"

        value={discipline}

        options={disciplineOptions}

        onChange={
          value =>
            setDiscipline(
              String(value)
            )
        }

        fullWidth={false}

      />



      <SelectField

        label="Status"

        value={status}

        options={statusOptions}

        onChange={
          value =>
            setStatus(
              String(value)
            )
        }

        fullWidth={false}

      />



      <TextField

        label="Search"

        value={search}

        placeholder="WBS / Project"

        onChange={
          value =>
            setSearch(value)
        }

        fullWidth={false}

      />


    </FilterPanel>

  );

}