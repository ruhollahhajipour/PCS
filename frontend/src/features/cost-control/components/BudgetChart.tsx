import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


import {
  EnterpriseChartContainer,
  EnterpriseTooltip,
  ChartLegend,
} from "../../../components/Common/Charts";



type Props = {

  data: {

    name:string;

    budget:number;

    actual:number;

  }[];

};



export default function BudgetChart({

  data,

}:Props){


  return (


    <EnterpriseChartContainer


      title="Budget vs Actual"


      subtitle="Project cost performance comparison"


      height={350}


      footer={


        <ChartLegend


          items={[

            {

              name:"Budget",

              color:"#1976D2",

            },


            {

              name:"Actual",

              color:"#D32F2F",

            },

          ]}


        />


      }


    >



      <ResponsiveContainer

        width="100%"

        height="100%"

      >


        <BarChart

          data={data}

        >



          <CartesianGrid

            strokeDasharray="3 3"

          />



          <XAxis

            dataKey="name"

          />



          <YAxis />



          <EnterpriseTooltip />



          <Bar

            dataKey="budget"

            name="Budget"

          />



          <Bar

            dataKey="actual"

            name="Actual"

          />



        </BarChart>


      </ResponsiveContainer>



    </EnterpriseChartContainer>


  );

}