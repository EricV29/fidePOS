"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataItem {
  [key: string]: string | number;
}

interface BarChartExampleProps {
  chartData: DataItem[];
  chartConfig: ChartConfig;
  xKey: string;
  yKey: string;
}

const BarChartExample: React.FC<BarChartExampleProps> = ({
  chartData,
  chartConfig,
  xKey,
  yKey,
}) => {
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="min-w-[200px] w-full max-h-full h-[200px] min-h-[100px]"
      >
        <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 15)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey={yKey}
            fill={`var(--color-${yKey})`}
            radius={10}
            barSize={60}
          >
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
