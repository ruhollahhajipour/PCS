import {
  ResponsiveContainer,
  LineChart,
  Line,
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

    pv:number;

    ev:number;

    ac:number;

  }[];

};



export default function SCurveChart({

  data,

}:Props){


  return (

    <EnterpriseChartContainer


      title="S Curve"


      subtitle="Planned Value vs Earned Value vs Actual Cost"


      height={350}



      footer={


        <ChartLegend


          items={[


            {

              name:"PV",

              color:"#1976D2",

            },


            {

              name:"EV",

              color:"#2E7D32",

            },


            {

              name:"AC",

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


        <LineChart

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



          <Line

            dataKey="pv"

            name="PV"

            type="monotone"

          />



          <Line

            dataKey="ev"

            name="EV"

            type="monotone"

          />



          <Line

            dataKey="ac"

            name="AC"

            type="monotone"

          />



        </LineChart>


      </ResponsiveContainer>



    </EnterpriseChartContainer>

  );

}