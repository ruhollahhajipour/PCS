import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";


import {
  EnterpriseChartContainer,
  EnterpriseTooltip,
  ChartLegend,
} from "../../../components/Common/Charts";



type Props = {

  data: {

    name:string;

    commitment:number;

    actual:number;

  }[];

};



export default function CashFlowChart({

  data,

}:Props){


  return (


    <EnterpriseChartContainer


      title="Cash Flow"


      subtitle="Commitment vs Actual cash movement"


      height={340}



      footer={


        <ChartLegend


          items={[


            {

              name:"Commitment",

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


        <AreaChart

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



          <Area

            dataKey="commitment"

            name="Commitment"

            type="monotone"

            stroke="#1976D2"

            fill="#1976D2"

            fillOpacity={0.15}

          />



          <Area

            dataKey="actual"

            name="Actual"

            type="monotone"

            stroke="#D32F2F"

            fill="#D32F2F"

            fillOpacity={0.15}

          />



        </AreaChart>


      </ResponsiveContainer>



    </EnterpriseChartContainer>


  );

}