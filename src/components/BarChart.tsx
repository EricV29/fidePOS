"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarChartExampleProps {}

const chartData = [
  { category: "Edredones", sales: 14 },
  { category: "Maquillaje", sales: 39 },
  { category: "Jueguetes", sales: 26 },
  { category: "Dulces", sales: 53 },
  { category: "Peluches", sales: 42 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#F57C00",
  },
} satisfies ChartConfig;

const BarChartExample: React.FC<BarChartExampleProps> = ({}) => {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="min-w-[200px] w-full max-h-full h-[200px] min-h-[100px]"
      >
        <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 15)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="sales" fill="#F57C00" radius={10} barSize={60}>
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  );
};
export default BarChartExample;
