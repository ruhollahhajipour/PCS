import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";


import {
  EnterpriseChartContainer,
  EnterpriseTooltip,
  ChartLegend,
} from "../../../components/Common/Charts";



type Props = {

  budget:number;

  actual:number;

  forecast:number;

};



const COLORS = [

  "#2563EB",

  "#10B981",

  "#F59E0B",

];




export default function CostBreakdownChart({

  budget,

  actual,

  forecast,

}:Props) {



  const data = [

    {
      name:"Budget",

      value:budget,

    },


    {
      name:"Actual",

      value:actual,

    },


    {
      name:"Forecast",

      value:forecast,

    },

  ];




  return (


    <EnterpriseChartContainer


      title="Cost Breakdown"


      subtitle="Budget allocation and cost status"


      height={340}


      footer={

        <ChartLegend

          items={[

            {
              name:"Budget",

              color:"#2563EB",

            },


            {
              name:"Actual",

              color:"#10B981",

            },


            {
              name:"Forecast",

              color:"#F59E0B",

            },

          ]}

        />

      }


    >



      <ResponsiveContainer

        width="100%"

        height="100%"

      >



        <PieChart>



          <Pie
  data={data}
  dataKey="value"
  nameKey="name"
  innerRadius={75}
  outerRadius={120}
  paddingAngle={4}
  name="Cost"
>


            {

              data.map(

                (_,index)=>(

                  <Cell

                    key={index}

                    fill={COLORS[index]}

                  />

                )

              )

            }


          </Pie>




          <EnterpriseTooltip />



        </PieChart>



      </ResponsiveContainer>



    </EnterpriseChartContainer>


  );

}